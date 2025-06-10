# Copyright (c) 2025, Your Organization and contributors
# For license information, please see license.txt

import frappe
import requests
from frappe.model.document import Document

class Player(Document):
    def validate(self):
        self.validate_cedula()
        self.set_full_name()
    
    def validate_cedula(self):
        # Validar que el número de cédula solo contenga dígitos
        if self.cedula_number and not self.cedula_number.isdigit():
            frappe.throw("El número de cédula debe contener solo dígitos")
    
    def set_full_name(self):
        # Crear un nombre completo para mostrar en las listas
        self.full_name = f"{self.last_name_paternal} {self.last_name_maternal}, {self.first_name} {self.second_name or ''}"

@frappe.whitelist()
def get_cedula(identificacion):
    token_free = frappe.db.get_single_value("OKM_CEDULAS_CONFIG", "token_free")
    url = "https://s123-cat-pro.azurewebsites.net/comparator/api/catalogs/person"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token_free}"
    }
 
    body = {
        "identification": identificacion
    }

    try:
        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()  # Lanza una excepción para códigos de error 4xx o 5xx
        return response.json()
    except requests.exceptions.RequestException as e:
        frappe.throw(f"Error al llamar a la API:{token_free} {e}")
        return None

 
