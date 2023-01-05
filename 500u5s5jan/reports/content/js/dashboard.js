/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 94.55587392550143, "KoPercent": 5.444126074498567};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [5.628325828898894E-4, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.011, 500, 1500, "test-state"], "isController": false}, {"data": [0.0, 500, 1500, "getTestState"], "isController": false}, {"data": [0.0, 500, 1500, "sub-login"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.0, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.0, 500, 1500, "menu"], "isController": false}, {"data": [0.0, 500, 1500, "userProfile"], "isController": false}, {"data": [0.0, 500, 1500, "referral_page"], "isController": false}, {"data": [0.0, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.0, 500, 1500, "updateModal"], "isController": false}, {"data": [0.0, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.0, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.0, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "getResults"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9772, 532, 5.444126074498567, 32002.536635284327, 1, 181307, 17271.0, 79114.20000000004, 129043.15000000001, 166138.1800000001, 17.566503561117845, 100.38975988745, 4.738308158370875], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 386, 0, 0.0, 88912.34455958546, 5937, 170961, 88832.5, 158693.4, 164853.55, 170086.31, 1.927811933455528, 0.3878117867470421, 0.48947374417536094], "isController": false}, {"data": ["test-state", 500, 1, 0.2, 16327.437999999987, 573, 33249, 16269.0, 28772.4, 30010.149999999998, 32826.26, 1.9742245246067345, 0.5977234661756112, 0.5282592966232863], "isController": false}, {"data": ["getTestState", 500, 128, 25.6, 19937.884000000002, 10, 130290, 16669.0, 39700.4, 45533.399999999994, 108974.26000000002, 1.9663904543541786, 0.5140882044102205, 0.5050282140160379], "isController": false}, {"data": ["sub-login", 500, 0, 0.0, 97147.22599999998, 2029, 172278, 104003.0, 155430.2, 164070.84999999998, 170386.91, 2.589559930185464, 0.8623234567517596, 0.6641462560789919], "isController": false}, {"data": ["getQuestionWiseAnalysis", 500, 1, 0.2, 21360.463999999985, 2505, 33638, 20439.0, 30090.300000000003, 32221.7, 33280.63, 1.9592783585949625, 58.14786875822897, 0.5204218338551545], "isController": false}, {"data": ["sub-user-1", 386, 0, 0.0, 40163.474093264245, 6029, 81997, 38824.5, 73326.9, 76400.9, 78732.15, 3.263911789824374, 89.02300744685573, 0.8318985016446394], "isController": false}, {"data": ["extras", 500, 1, 0.2, 18794.363999999987, 501, 55566, 18020.0, 28111.2, 30143.85, 31170.96, 2.2738538639598707, 2.592846249675976, 0.5728912634555302], "isController": false}, {"data": ["testLeaderboard", 500, 2, 0.4, 26530.088000000018, 16, 33586, 29425.0, 32096.5, 32719.9, 33424.76, 2.2293859825126963, 20.013067336931563, 0.5856492473592924], "isController": false}, {"data": ["menu", 500, 37, 7.4, 14590.016000000003, 2, 107192, 12414.0, 19638.800000000003, 21224.85, 59193.170000000006, 1.7750260928835653, 0.8768351551017801, 0.44547954659621], "isController": false}, {"data": ["userProfile", 500, 79, 15.8, 53748.63199999998, 11, 128896, 59116.0, 79054.1, 97500.04999999999, 114830.11000000002, 2.0616601312040506, 2.427918885528383, 0.5234563126486973], "isController": false}, {"data": ["referral_page", 500, 18, 3.6, 14548.204000000016, 1, 113757, 12759.5, 16900.0, 20183.449999999997, 64869.98000000001, 1.6993623992278097, 28.360596018436382, 0.44142597853535354], "isController": false}, {"data": ["get-priority", 500, 55, 11.0, 23718.891999999993, 1, 130910, 18014.5, 57791.5, 61237.5, 92583.03000000017, 1.8168142525444484, 0.7629661775045693, 0.48435487310460856], "isController": false}, {"data": ["sub-user", 500, 114, 22.8, 99730.76599999999, 1, 181307, 99902.5, 170042.80000000002, 174561.75, 178577.65, 1.8640093349587497, 39.6734254188895, 0.8400493007168981], "isController": false}, {"data": ["updateModal", 500, 62, 12.4, 17659.346000000005, 1, 126464, 15998.5, 21385.5, 54305.85, 74874.00000000009, 1.771341117787099, 2.0109530601246317, 0.44974420173626856], "isController": false}, {"data": ["olympiadTestCard", 500, 12, 2.4, 14049.015999999998, 7, 85988, 13305.0, 15966.7, 17146.75, 33828.29, 1.78768073452226, 2.7852764156643737, 0.46436752861183017], "isController": false}, {"data": ["checkLQLiveUpsell", 500, 5, 1.0, 12291.269999999999, 32, 61394, 12101.0, 14363.600000000002, 15123.25, 20932.850000000002, 1.8132169006320875, 0.49346768779487443, 0.48516655417166815], "isController": false}, {"data": ["moengageAttributes", 500, 6, 1.2, 13800.838000000002, 3, 43879, 13453.5, 17492.8, 17961.85, 18505.260000000002, 2.1502786761164248, 0.5185615415132802, 0.5711551740543075], "isController": false}, {"data": ["dashboardUpsell", 500, 8, 1.6, 13283.965999999995, 11, 61558, 12755.5, 15137.5, 15870.55, 39043.11000000016, 1.891217187381799, 0.48756465598759363, 0.4968028086939254], "isController": false}, {"data": ["getResults", 500, 2, 0.4, 24382.580000000016, 240, 33522, 29620.0, 32640.9, 32880.5, 33332.04, 2.5680666053754773, 15.29029866293612, 0.6645725019774112], "isController": false}, {"data": ["getQuestionsSummary", 500, 1, 0.2, 23910.054000000015, 2507, 33445, 26249.0, 31497.600000000002, 32536.9, 33284.590000000004, 2.1245766780968895, 0.6453152685889836, 0.5684777952524209], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 532, 100.0, 5.444126074498567], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9772, 532, "500/Internal Server Error", 532, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["test-state", 500, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["getTestState", 500, 128, "500/Internal Server Error", 128, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["getQuestionWiseAnalysis", 500, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["extras", 500, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["testLeaderboard", 500, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["menu", 500, 37, "500/Internal Server Error", 37, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["userProfile", 500, 79, "500/Internal Server Error", 79, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["referral_page", 500, 18, "500/Internal Server Error", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["get-priority", 500, 55, "500/Internal Server Error", 55, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["sub-user", 500, 114, "500/Internal Server Error", 114, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["updateModal", 500, 62, "500/Internal Server Error", 62, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["olympiadTestCard", 500, 12, "500/Internal Server Error", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["checkLQLiveUpsell", 500, 5, "500/Internal Server Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["moengageAttributes", 500, 6, "500/Internal Server Error", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["dashboardUpsell", 500, 8, "500/Internal Server Error", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["getResults", 500, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["getQuestionsSummary", 500, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
