package pucp.edu.pe.sap_backend.Service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.pdf.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.view.document.AbstractPdfView;
import pucp.edu.pe.sap_backend.Genetico.Pedido;
import pucp.edu.pe.sap_backend.Ruta.Cell;
import pucp.edu.pe.sap_backend.Genetico.Vehiculo;

import java.awt.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class ReporteSimulacionPDFService extends AbstractPdfView {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    @Override
    protected void buildPdfDocument(Map<String, Object> model, Document document, PdfWriter writer,
                                    HttpServletRequest request, HttpServletResponse response) throws Exception {

        List<Vehiculo> vehiculos = (List<Vehiculo>)model.get("Vehiculos");
        LocalDateTime fecha = (LocalDateTime)model.get("Fecha");

        document.setPageSize(PageSize.LETTER.rotate());
        document.setMargins(-20,-20,30,40);
        document.open();

        Font fuentetitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD,16, Color.white);
        Font fuentesubtitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD,14, Color.BLACK);
        Font fuenteTituloColumnas = FontFactory.getFont(FontFactory.HELVETICA_BOLD,12,Color.white);
        Font fuenteDataCeldas = FontFactory.getFont(FontFactory.COURIER,10,Color.BLACK);
        Font fuenteResaltado = FontFactory.getFont(FontFactory.COURIER_BOLD,10,Color.BLACK);
        PdfPTable tablaTitulo = new PdfPTable(1);
        PdfPCell celda = null;

        celda = new PdfPCell(new Phrase("REPORTE DE FIN DE SIMULACIÓN"+ fecha.format(formatter),fuentetitulo));
        celda.setBorder(0);
        celda.setBackgroundColor(new Color(0,143,57));
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(30);


        tablaTitulo.addCell(celda);
        tablaTitulo.setSpacingAfter(10);

        PdfPTable tablaSubTitulo = new PdfPTable(1);
        celda = new PdfPCell(new Phrase("RESUMEN DE PEDIDOS ENTREGADOS ",fuentesubtitulo));
        celda.setBorder(0);
        celda.setHorizontalAlignment(Element.ALIGN_LEFT);
        celda.setVerticalAlignment(Element.ALIGN_LEFT);
        celda.setPadding(30);

        tablaSubTitulo.addCell(celda);
        tablaSubTitulo.setSpacingAfter(10);


        PdfPTable tablaRutasEntregados = new PdfPTable(8);
        tablaRutasEntregados.setWidths(new float[]{0.5f,0.8f,1.5f,1f,1f,1f,1f,1.2f});

        celda = new PdfPCell(new Phrase("N#",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutasEntregados.addCell(celda);

        celda = new PdfPCell(new Phrase("TIPO DE VEHICULO",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutasEntregados.addCell(celda);


        celda = new PdfPCell(new Phrase("TRAMO DE RUTA",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutasEntregados.addCell(celda);

        celda = new PdfPCell(new Phrase("POSICION X",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutasEntregados.addCell(celda);

        celda = new PdfPCell(new Phrase("POSICION Y",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutasEntregados.addCell(celda);

        celda = new PdfPCell(new Phrase("CLIENTE",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutasEntregados.addCell(celda);

        celda = new PdfPCell(new Phrase("ORDEN(GLP)",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutasEntregados.addCell(celda);


        celda = new PdfPCell(new Phrase("PEDIDO",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutasEntregados.addCell(celda);

        String rango ="";
        final int[] j = {1};
        for(Vehiculo lista: vehiculos){
            int posicionFinal = lista.getRoute().size() - 1;
            for(Cell posicion : lista.getRoute()) {
                for (Pedido pedido : lista.getOrder()) {
                    rango ="[("+String.valueOf(lista.getXInicial())+","+String.valueOf(lista.getYInicial())+") : "+
                            "("+String.valueOf(lista.getRoute().get(posicionFinal).getX())+","+
                            String.valueOf(lista.getRoute().get(posicionFinal).getY())+")]" ;
                    if(pedido.getX() == posicion.getX() && pedido.getY() == posicion.getY()){
                        celda = new PdfPCell(new Phrase(String.valueOf(j[0]), fuenteDataCeldas));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        tablaRutasEntregados.addCell(celda);

                        celda = new PdfPCell(new Phrase(lista.getTipo(), fuenteDataCeldas));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        tablaRutasEntregados.addCell(celda);

                        celda = new PdfPCell(new Phrase(rango, fuenteDataCeldas));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        tablaRutasEntregados.addCell(celda);

                        celda = new PdfPCell(new Phrase(String.valueOf(posicion.getX()), fuenteDataCeldas));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        tablaRutasEntregados.addCell(celda);

                        celda = new PdfPCell(new Phrase(String.valueOf(posicion.getY()), fuenteDataCeldas));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        tablaRutasEntregados.addCell(celda);

                        celda = new PdfPCell(new Phrase(pedido.getNombrePedido(), fuenteDataCeldas));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        tablaRutasEntregados.addCell(celda);

                        celda = new PdfPCell(new Phrase(String.valueOf(pedido.getCantidadAEntregar()), fuenteDataCeldas));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        tablaRutasEntregados.addCell(celda);

                        celda = new PdfPCell(new Phrase("ENTREGADO", fuenteResaltado));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        tablaRutasEntregados.addCell(celda);

                        j[0]++;
                    }
                }
            }
        }
        tablaRutasEntregados.setSpacingAfter(30);


//
//        PdfPTable tablaRutas = new PdfPTable(5);
//        tablaRutas.setWidths(new float[]{0.5f,1f,1f,1f,1.5f});
//
//        celda = new PdfPCell(new Phrase("N#",fuenteTituloColumnas));
//        celda.setBackgroundColor(Color.DARK_GRAY);
//        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
//        celda.setVerticalAlignment(Element.ALIGN_CENTER);
//        celda.setPadding(10);
//        tablaRutas.addCell(celda);
//
//        celda = new PdfPCell(new Phrase("TIPO DE VEHICULO",fuenteTituloColumnas));
//        celda.setBackgroundColor(Color.DARK_GRAY);
//        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
//        celda.setVerticalAlignment(Element.ALIGN_CENTER);
//        celda.setPadding(10);
//        tablaRutas.addCell(celda);
//
//        celda = new PdfPCell(new Phrase("POSICION X",fuenteTituloColumnas));
//        celda.setBackgroundColor(Color.DARK_GRAY);
//        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
//        celda.setVerticalAlignment(Element.ALIGN_CENTER);
//        celda.setPadding(10);
//        tablaRutas.addCell(celda);
//
//        celda = new PdfPCell(new Phrase("POSICION Y",fuenteTituloColumnas));
//        celda.setBackgroundColor(Color.DARK_GRAY);
//        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
//        celda.setVerticalAlignment(Element.ALIGN_CENTER);
//        celda.setPadding(10);
//        tablaRutas.addCell(celda);
//
//        celda = new PdfPCell(new Phrase("PEDIDO",fuenteTituloColumnas));
//        celda.setBackgroundColor(Color.DARK_GRAY);
//        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
//        celda.setVerticalAlignment(Element.ALIGN_CENTER);
//        celda.setPadding(10);
//        tablaRutas.addCell(celda);
//
//
//        final int[] n = {1};
//
//        for(Vehiculo lista: vehiculos){
//           for(Cell posicion : lista.getRoute()) {
//               for (Pedido pedido : lista.getOrder()) {
//                   celda = new PdfPCell(new Phrase(String.valueOf(n[0]), fuenteDataCeldas));
//                   celda.setPadding(5);
//                   celda.setHorizontalAlignment(Element.ALIGN_CENTER);
//                   celda.setVerticalAlignment(Element.ALIGN_CENTER);
//                   tablaRutas.addCell(celda);
//
//                   celda = new PdfPCell(new Phrase(lista.getTipo(), fuenteDataCeldas));
//                   celda.setPadding(5);
//                   celda.setHorizontalAlignment(Element.ALIGN_CENTER);
//                   celda.setVerticalAlignment(Element.ALIGN_CENTER);
//                   tablaRutas.addCell(celda);
//
//
//                   celda = new PdfPCell(new Phrase(String.valueOf(posicion.getX()), fuenteDataCeldas));
//                   celda.setPadding(5);
//                   celda.setHorizontalAlignment(Element.ALIGN_CENTER);
//                   celda.setVerticalAlignment(Element.ALIGN_CENTER);
//                   tablaRutas.addCell(celda);
//
//                   celda = new PdfPCell(new Phrase(String.valueOf(posicion.getY()), fuenteDataCeldas));
//                   celda.setPadding(5);
//                   celda.setHorizontalAlignment(Element.ALIGN_CENTER);
//                   celda.setVerticalAlignment(Element.ALIGN_CENTER);
//                   tablaRutas.addCell(celda);
//                   if(pedido.getX() == posicion.getX() && pedido.getY() == posicion.getY()){
//
//                       celda = new PdfPCell(new Phrase("ENTREGADO", fuenteResaltado));
//                       celda.setPadding(5);
//                       celda.setHorizontalAlignment(Element.ALIGN_CENTER);
//                       celda.setVerticalAlignment(Element.ALIGN_CENTER);
//                       tablaRutas.addCell(celda);
//
//                   }
//                   else{
//                       celda = new PdfPCell(new Phrase("-", fuenteDataCeldas));
//                       celda.setPadding(5);
//                       celda.setHorizontalAlignment(Element.ALIGN_CENTER);
//                       celda.setVerticalAlignment(Element.ALIGN_CENTER);
//                       tablaRutas.addCell(celda);
//                   }
//                   n[0]++;
//               }
//
//           }
//
//        }


        String imagePath = "Extra/logo.png";
        BackgroundImage event = new BackgroundImage(imagePath);
        writer.setPageEvent(event);
        PdfContentByte cb = writer.getDirectContent();
        FooterEvent footerEvent = new FooterEvent();
        writer.setPageEvent(new PdfPageEventHelper() {
            @Override
            public void onEndPage(PdfWriter writer, Document document) {
                footerEvent.onEndPage(writer, document);
            }
        });

        document.add(tablaTitulo);
        document.add(tablaSubTitulo);
        document.add(tablaRutasEntregados);
        //document.add(tablaRutas);


    }
}
class FooterEvent extends PdfPageEventHelper {
    @Override
    public void onEndPage(PdfWriter writer, Document document) {
        try {
            PdfContentByte cb = writer.getDirectContent();
            Font fuenteDataCeldas = FontFactory.getFont(FontFactory.COURIER, 10, Color.BLACK);
            Phrase footer = new Phrase("SAG \n", fuenteDataCeldas);
            ColumnText.showTextAligned(cb, Element.ALIGN_CENTER, footer,
                    (document.right() - document.left()) / 2 + document.leftMargin(), document.bottom() - 20, 0);
        } catch (DocumentException e) {
            e.printStackTrace();
        }
    }
}
class BackgroundImage extends PdfPageEventHelper {
    private String imagePath;

    public BackgroundImage(String imagePath) {
        this.imagePath = imagePath;
    }

    @Override
    public void onEndPage(PdfWriter writer, Document document) {
        try {
            PdfContentByte canvas = writer.getDirectContentUnder();
            float width = PageSize.LETTER.getWidth();
            float height = PageSize.LETTER.getHeight();

            Image logo = Image.getInstance(ClassLoader.getSystemResource(imagePath));
            float imageWidth = logo.getScaledWidth();
            float imageHeight = logo.getScaledHeight();

            float x = (width - imageWidth) / 2;
            float y = (height - imageHeight) / 2;

            logo.setAbsolutePosition(x+100, y-100);

            PdfGState gs = new PdfGState();
            gs.setFillOpacity(0.2f);
            canvas.setGState(gs);

            canvas.addImage(logo);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}