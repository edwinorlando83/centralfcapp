 

frappe.ui.form.on("Player", {
  refresh: (frm) => {
    // Agregar botones personalizados o lógica adicional aquí

    // Solo los administradores pueden ver y editar el código de carnet
    if (!frappe.user.has_role("System Manager") && !frappe.user.has_role("Player Manager")) {
      frm.set_df_property("card_code", "read_only", 1)
    }

    // Agregar botón para consultar cédula
    frm.add_custom_button(__("Consultar Cédula"), () => {
      if (!frm.doc.cedula_number) {
        frappe.msgprint(__("Por favor ingrese un número de cédula primero"))
        return
      }
//\\kento15\frappe-bench\apps\centralfcapp\centralfcapp\central_fc\doctype\player\player.py
      frappe.call({
        method: "centralfcapp.central_fc.doctype.player.player.get_cedula",
        args: {
          identificacion: frm.doc.cedula_number,
        },
        callback: (r) => {
          console.log(r.message);
          if (r.message   && r.message.message.data) {
            const data = r.message.message.data

            // Actualizar campos con la información obtenida
            frm.set_value("first_name", data.names.split(" ")[0])
            if (data.names.split(" ").length > 1) {
              frm.set_value("second_name", data.names.split(" ")[1])
            }
            frm.set_value("last_name_paternal", data.firstLastName)
            frm.set_value("last_name_maternal", data.secondLastName)
            frm.set_value("gender", data.gender)
            frm.set_value("birthDate", data.birthDate)

            frappe.show_alert(
              {
                message: __("Información de cédula cargada correctamente"),
                indicator: "green",
              },
              5,
            )
          } else {
            frappe.msgprint(__("No se pudo obtener información para esta cédula"))
          }
        },
      })
    })
  },

  validate: (frm) => {
    // Validaciones adicionales en el lado del cliente
    if (frm.doc.cedula_number && frm.doc.cedula_number.length < 10) {
      frappe.throw(__("El número de cédula debe tener al menos 10 dígitos"))
      return false
    }
  },
})
