 

frappe.listview_settings["Player"] = {
  add_fields: ["cedula_number", "last_name_paternal", "last_name_maternal", "first_name", "second_name"],
  get_indicator: (doc) => {
    // Puedes agregar indicadores visuales según el estado del jugador si lo necesitas en el futuro
    return [__("Active"), "green", "status,=,Active"]
  },
  formatters: {
    cedula_number: (value, df, doc) => value,
  },
}
