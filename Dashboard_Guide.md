# Guía Técnica y Estratégica del Dashboard: Colonial SFL — Europolis Portfolio

Este documento es la **guía definitiva y detallada** del Dashboard del Plan Estratégico de Inversión (2025–2035) para el portfolio Europolis de Colonial SFL. Explica qué significa cada métrica, de dónde provienen los números, cómo se calculan matemáticamente y cuál es la lógica financiera detrás de cada sección.

---

## 1. EXECUTIVE SUMMARY (Resumen Ejecutivo)

Esta sección presenta la "foto final" del plan de negocio a 10 años, mostrando los resultados agregados de la ejecución de la estrategia de valor añadido.

*   **Levered IRR (10.7%)**: La Tasa Interna de Retorno Apalancada a 10 años.
    *   *Qué representa:* Es la rentabilidad media anualizada que obtiene el accionista (Equity) por su dinero invertido, una vez pagados los intereses y el principal de la deuda.
    *   *Cómo se calcula:* Se aplica la fórmula financiera TIR (Tasa Interna de Retorno) a la serie histórica de flujos de caja del accionista (Cash Flow to Equity). Inversión inicial en T=0 (NAV), dividendos recibidos del año 1 al 10, y el dinero recibido al vender el portfolio en el año 10 neto de deuda.
*   **Starting NAV (€2.5bn)**: Valor Liquidativo Neto (Net Asset Value) en 2025.
    *   *Qué representa:* El valor del patrimonio neto actual del portfolio de Europolis. Es el valor de los "ladrillos" menos lo que le debemos al banco.
    *   *Cómo se calcula:* Gross Asset Value total (Valor Bruto de los inmuebles, calculado capitalizando rentas) menos la Deuda Pendiente de pago.
*   **Terminal NAV (€4.9bn)**: Valor Liquidativo Neto proyectado para 2035.
    *   *Qué representa:* El valor del portfolio al finalizar los 10 años del plan de negocio. Refleja la inmensa creación de valor conseguida tras reformar los activos, subir las rentas, estabilizarlos y beneficiarse de la inflación.
    *   *Cómo se calcula:* Se calcula el GAV del año 10 dividiendo el Net Rental Income (NRI) estabilizado del año 11 entre la Exit Yield estimada. A ese GAV gigante se le resta la deuda viva que quede en 2035.
*   **NAV Growth (+100%)**: Crecimiento del patrimonio neto.
    *   *Qué representa:* Indica que el valor del equity se duplica exactamente en la década de gestión (pasa de €2.5bn a €4.9bn).
    *   *Cómo se calcula:* `[(Terminal NAV / Starting NAV) - 1] * 100`.
*   **Cum. FCF (€1,400m)**: Flujo de Caja Libre Acumulado (Cash to Equity).
    *   *Qué representa:* El dinero "cash" total generado durante los 10 años, disponible para repartir como dividendos a los accionistas, sumando año a año el dinero sobrante tras pagar operaciones, impuestos, capex y servicio de la deuda.
*   **Total Capex (€80m)**: Gasto de Capital Total invertido.
    *   *Qué representa:* El dinero inyectado para reformar (Refurbishment/Build-up) los activos del portfolio. Es el "motor" de la creación de valor. Principalmente va destinado a *Skyhigh*, *Prime Tower* y *Sleeping Beauty*.

---

## 2. TIMELINE & CAPITAL RECYCLING (Fases del Plan)

El dashboard divide la estrategia en tres fases temporales (horizontes temporales) que explican "cuándo" pasan las cosas.

1.  **2025–2026: Capital Recycling (Reciclaje de Capital)**
    *   En esta primera fase, la caja (liquidez) es el rey. Se venden activos no estratégicos (*Polygon HQ* por su baja rentabilidad y *Metro One* aprovechando su buen precio) para generar €141m.
    *   Ese dinero se usa inmediatamente para reducir el endeudamiento, bajando el LTV (Loan-to-Value) del 36% al 33%, desapalancando financieramente a la firma para afrontar reformas con seguridad.
    *   Arranca la reforma urgente (Build-up) de *Skyhigh*.
2.  **2027–2031: Value Creation (Creación de Valor)**
    *   Se inyecta el Capex fuerte. Es el "Valle de la Muerte" financiero: perdemos rentas temporalmente porque los edificios están en obras y vacíos (*Sleeping Beauty* y *Prime Tower*).
    *   A lo largo de estos años, se re-alquilan los edificios ya reformados a precios récord (Mark-to-Market premium), inyectando nueva vida a la línea de ingresos.
3.  **2032–2035: Core Stabilization (Estabilización y Rentabilización)**
    *   Terminan las obras. El 100% de los edificios retenidos están completamente alquilados, modernos y eficientes (ESG compliant).
    *   El NRI se dispara y alcanza su techo de crecimiento estable. Se maximiza la generación de dividendo anual y la valoración GAV explota positivamente debido a la compresión de yields (menos riesgo = mayor valor).

---

## 3. ASSETS MATRIX (Comportamiento por Edificio)

Cada edificio del portfolio se etiqueta anualmente con un **Status** que dicta sus finanzas en ese año específico.

### Los Status y sus implicaciones financieras:
*   **HOLD (Mantener):** Edificio alquilado y funcionando con normalidad. Su renta crece a ritmo de inflación (indexación). No requiere Capex extraordinario.
*   **BU (Build-up) / FR (Full Refurbishment):** Edificio en obras mayores.
    *   *Impacto:* La ocupación cae (a veces a 0%). El Net Rental Income (NRI) se hunde. Aparecen gastos millonarios de Capex negativo en la caja.
*   **RELET (Realquiler):** Periodo donde el edificio (recién reformado o no) está buscando inquilinos. Su ocupación sube paulatinamente. Las rentas (Passing Rent) pactadas saltan al precio de mercado actual (ERV).
*   **STB (Stable):** El activo ha superado su fase de obras o comercialización y opera a ocupación "crucero" de mercado sin alteraciones.
*   **SALE / SOLD:** El activo se vende (ej. Metro One).
    *   *Impacto:* A partir de ese año, el edificio ya no genera rentas (NRI = €0) ni tiene valor inmobiliario contable (GAV = €0). A cambio, inyecta cientos de millones en efectivo durante el año de venta, alterando positivamente el Free Cash Flow.

---

## 4. FINANCIALS (La Cuenta de Resultados Consolidada)

Esta sección consolida las sumas totales de todos los edificios año a año.

*   **Gross Rental Income (GRI):** El dinero bruto total facturado a los inquilinos.
    *   *Fórmula base:* Suma de `[Área Alquilable (GLA) × Renta actual (Passing Rent) × Porcentaje de Ocupación]` de todos los activos.
*   **Net Rental Income (NRI):** El ingreso real de los alquileres tras quitar costes directos no repercutibles (Ej. IBI de locales vacíos, seguros, gestión).
    *   *Fórmula base:* `GRI × Margen de Eficiencia operativa (Ej. 85-95%)`. Esta es la métrica clave del Real Estate.
*   **Operating Margin:** El porcentaje que el NRI representa respecto al GRI. Mide la eficiencia en la gestión del edificio. Un margen del 90% es excelente.
*   **Capex:** Inversión de capital en reformas ("ladrillo").
*   **Free Cash Flow (to equity):** La caja generada después de pagar bancos y reformas.
    *   *Fórmula:* `NRI - Capex - Intereses de Deuda - Devolución Principal de Deuda + Entradas por Venta de Activos`.
    *   *Nota analítica:* Fíjate cómo en 2027 a 2030 el FCF es muy bajo o negativo. Es por culpa de las fuertes salidas de caja para pagar las reformas (Capex) combinadas con la pérdida temporal de alquileres. A partir de 2032, el FCF casi se triplica frente a 2025.

---

## 5. INVESTMENT MODEL & DCF ANALYSIS (Valoración Corporativa)

La sección para inversores institucionales donde se usa la metodología clásica de **Descuento de Flujos de Caja Libres (FCFF)** para trazar el valor total (Enterprise Value).

*   **FCFF (Free Cash Flow to the Firm):**
    *   *Qué representa:* El flujo de caja puro generado por los ladrillos *sin* importar cómo se financia (antes de pagar deuda).
    *   *Fórmula:* `EBITDA (asimilable al NRI) - Cambios en Working Capital - Capex`.
*   **WACC (Weighted Average Cost of Capital) - 6.50%:**
    *   Es la tasa que usamos para traer el dinero del futuro al presente (descontar los flujos). Mezcla lo que nos cuesta la deuda (intereses al banco) y la rentabilidad exigida (Yield) por los accionistas.
*   **Terminal Value (Valor Terminal):**
    *   A finales de la década (2035), el negocio seguirá vivo para siempre. Usamos la fórmula de Gordon Growth Model: `FCFF del año 11 / (WACC - Tasa de Crecimiento a Largo Plazo)`. Este número monstruoso supone casi el 70-80% del valor total de cualquier DCF.
*   **Enterprise Value (EV):**
    *   Es la suma del valor presente de los flujos de los próximos 10 años MÁS el valor presente del Valor Terminal. Refleja cuánto habría que pagar para comprar toda la empresa "limpia" hoy.

### Matriz de Sensibilidad (Sensitivity Analysis)
Muestra la volatilidad de nuestra valoración de mercado ante cambios que no podemos controlar:
*   **Variables:** Tasa de WACC (tipo de interés/coste capital) vs Tasa de Crecimiento Terminal (Inflación a perpetuidad).
*   **Lectura:** Si el macro-entorno empeora (el WACC sube al 7% porque el BCE sube los tipos brutalmente), nuestro EV se desploma. Si el entorno ayuda (inflación alta 2.5% prolongada y dinero barato a WACC 6%), el portfolio revienta su techo de valoración.

---

## 6. PREGUNTAS FRECUENTES (FAQ PARA INVERSOR/CEO)

**P1: El crecimiento del NAV (+100%) parece irreal o demasiado optimista para un portfolio core. ¿A qué se debe este salto tan agresivo?**
*Respuesta:* No es un crecimiento "mágico", es apalancamiento operativo y financiero combinados. Primero, inyectamos €80m de Capex muy focalizado para transformar edificios antiguos en Trofeos (Premium). Esto nos permite disparar sus alquileres (NRI) en el futuro en más de un 30-40%. Segundo, los edificios reformados se valoran mejor en el mercado, por lo que su Exit Yield se comprime (baja), multiplicando artificialmente su valor GAV final. Tercero, la deuda se ha amortizado parcialmente en 10 años, por lo que la porción de NAV (GAV - Deuda) absorbe todo el crecimiento bruto.

**P2: Veo que vendemos *Polygon HQ* y *Metro One* al inicio (2025-2026). ¿Por qué malvendemos activos rentables en un momento temprano en vez de modernizarlos?**
*Respuesta:* La estrategia de *Capital Recycling*. Si modernizáramos *Prime Tower* simultáneamente sin vender nada, la empresa entraría en déficit de caja masivo asfixiada por el Capex y la pérdida de las rentas durante la obra. Al vender Polygon/Metro One (que ya están maduros y ofrecen crecimiento limitado), obtenemos una lluvia de *cash* instantánea de €141m. Usamos este dinero para reducir la deuda bancaria del 36% al 33%, dándonos un salvavidas de caja para pagar las grandes obras sin riesgo de impago bancario ("covenant breach").

**P3: La YOC (Yield on Cost) del modelo de "Investment Returns" muestra cifras espectaculares como retornos del 20%. ¿Cómo se calcula y por qué es tan alta?**
*Respuesta:* La **Yield on Cost incremental** se calcula comparando el NRI extra ganado frente al dinero inyectado.
Fórmula: `(NRI Año 1 Estabilizado tras obra - NRI original antes de la obra) / Capex total gastado`.
Ejemplo: Si gastamos €20m (capex) en reformar un activo y al terminarlo la nueva renta anual que nos pagan los inquilinos es \€5m superior a la antigua, el YOC incremental es del 25% (€5m / €20m). Como financiamos parte de esa obra con deuda que nos cuesta apenas un 5% de interés, el "Spread" obtenido es masivo, demostrando que es una operación enormemente rentable para el accionista, justificando tomar el riesgo de la obra.

**P4: En los gráficos anuales (Financials), hay un hundimiento severo del Free Cash Flow entre los años 2028 y 2030. ¿La empresa entra en bancarrota?**
*Respuesta:* No, pero es el punto de máxima tensión estructural "J-Curve" de la inversión privada real estate. Esos años coinciden letalmente: 
1) No ingresamos rentas de grandes edificios porque están vacíos en plenas obras (*Sleeping Beauty* y *Prime Tower* a la vez). 
2) Estamos pagando cientos de facturas a constructoras por ese mismo Capex, vaciando la tesorería. Para amortiguar este bache predecible es precisamente por lo que desapalancamos la firma en la Fase 1 vendiendo los dos edificios maduros. A partir de 2032, cuando terminan las obras y se alcanzan rentas record, la caja vuelve de forma explosiva a máximos intocables (€300m+).

**P5: El WACC base fijado en el DCF Analysis es del 6.50%. ¿Qué pasa si los tipos de interés del BCE saltan súbitamente un 2% y estalla una crisis hipotecaria?**
*Respuesta:* Por eso hemos desarrollado la "Sensitivity Matrix" interactiva en el Dashboard. Si el entorno se vuelve "Bear" (bajista o adverso), nuestro coste de capital WACC podría saltar al 7.5% o superior. Como se observa en la tabla cruzada abajo a la derecha, en este escenario el Enterprise Value sufriría un recorte a nivel valor contable, evaporando parte del crecimiento del NAV. Sin embargo, al ser activos "Prime CBD" (céntricos y calidad A+), tienen un colchón de protección frente a activos periféricos en crisis macroeconómicas, sufriendo menor volatilidad real en sus *Yields*.

**P6: ¿Cómo nos aseguramos de que los cálculos de Excel cuadran exactamente con estas pantallas web?**
*Respuesta:* El dashboard ha sido programado de forma *stateful* en ReactJS traduciendo linealmente la misma fórmula actuarial del Excel originario (.xlsx). Las fórmulas del cálculo del GAV por la inversa de la Yield y el descuento temporal de flujos (FCF) utilizan motores algebraicos idénticos. Cada euro del GAV₀ (ej. Prime Tower €1,215m) que ves fue calculado asilando el NRI de ese inmueble año al 2025 (`48.6 / 0.040 = 1,215`). 

---
_Esta guía es un desglose oficial validado para directiva e inversores. Permite auditar y defender los números presentados en cualquier comité de dirección o Due Diligence de terceros._
