import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount)
}

export const generateCortePDF = (ventas, estadisticas, user) => {
    const doc = new jsPDF()
    const today = new Date().toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    // Header
    doc.setFillColor(99, 102, 241) // primary indigo color
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.text('Corte de Caja', 105, 20, { align: 'center' })
    doc.setFontSize(12)
    doc.text(today, 105, 30, { align: 'center' })

    // Info General
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    doc.text(`Generado por: ${user?.nombre || 'Sistema'}`, 14, 50)
    doc.text(`Fecha y Hora: ${new Date().toLocaleString('es-MX')}`, 14, 57)

    // Resumen Cards
    const startY = 65

    // Total Ventas Box
    doc.setFillColor(240, 249, 255)
    doc.roundedRect(14, startY, 55, 25, 3, 3, 'F')
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text('Total Ventas', 20, startY + 8)
    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text(formatCurrency(estadisticas?.hoy?.monto || 0), 20, startY + 18)

    // Transacciones Box
    doc.setFillColor(240, 253, 244)
    doc.roundedRect(77, startY, 55, 25, 3, 3, 'F')
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text('Transacciones', 83, startY + 8)
    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text(`${estadisticas?.hoy?.total || 0}`, 83, startY + 18)

    // Promedio Box
    doc.setFillColor(255, 247, 237)
    doc.roundedRect(140, startY, 55, 25, 3, 3, 'F')
    const promedio = estadisticas?.hoy?.total > 0
        ? estadisticas.hoy.monto / estadisticas.hoy.total
        : 0
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text('Ticket Promedio', 146, startY + 8)
    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text(formatCurrency(promedio), 146, startY + 18)

    // Detalle de Ventas Table
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('Detalle de Transacciones del Día', 14, 105)

    const tableColumn = ["Hora", "Folio", "Cliente", "Método Pago", "Total"]
    const tableRows = ventas.map(venta => [
        new Date(venta.fechaVenta).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        venta.folio,
        venta.nombreCliente || 'Público General',
        venta.metodoPago,
        formatCurrency(venta.total)
    ])

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 110,
        theme: 'grid',
        headStyles: {
            fillColor: [99, 102, 241],
            textColor: 255,
            fontSize: 10,
            halign: 'center'
        },
        bodyStyles: {
            fontSize: 9
        },
        columnStyles: {
            0: { cellWidth: 30 },
            4: { halign: 'right' }
        },
        foot: [['', '', '', 'TOTAL', formatCurrency(estadisticas?.hoy?.monto || 0)]],
        footStyles: {
            fillColor: [241, 245, 249],
            textColor: 0,
            fontStyle: 'bold',
            halign: 'right'
        }
    })

    doc.save(`corte_caja_${new Date().toISOString().split('T')[0]}.pdf`)
}

export const generateCorteExcel = (ventas, estadisticas) => {
    const wb = XLSX.utils.book_new()

    // Preparar datos para Excel
    const data = [
        ["CORTE DE CAJA", ""],
        ["Fecha:", new Date().toLocaleString('es-MX')],
        ["", ""],
        ["RESUMEN", ""],
        ["Total Ventas:", estadisticas?.hoy?.monto || 0],
        ["Transacciones:", estadisticas?.hoy?.total || 0],
        ["Ticket Promedio:", estadisticas?.hoy?.total > 0 ? (estadisticas.hoy.monto / estadisticas.hoy.total) : 0],
        ["", ""],
        ["DETALLE DE TRANSACCIONES", "", "", "", ""],
        ["Hora", "Folio", "Cliente", "Método Pago", "Total"]
    ]

    ventas.forEach(venta => {
        data.push([
            new Date(venta.fechaVenta).toLocaleTimeString('es-MX'),
            venta.folio,
            venta.nombreCliente || 'Público General',
            venta.metodoPago,
            Number(venta.total)
        ])
    })

    const ws = XLSX.utils.aoa_to_sheet(data)

    // Estilos básicos (ancho de columnas)
    const wscols = [
        { wch: 15 },
        { wch: 15 },
        { wch: 30 },
        { wch: 20 },
        { wch: 15 }
    ]
    ws['!cols'] = wscols

    XLSX.utils.book_append_sheet(wb, ws, "Corte de Caja")
    XLSX.writeFile(wb, `corte_caja_${new Date().toISOString().split('T')[0]}.xlsx`)
}
