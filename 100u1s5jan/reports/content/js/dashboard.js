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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.065, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.04, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.1, 500, 1500, "test-state"], "isController": false}, {"data": [0.0, 500, 1500, "getTestState"], "isController": false}, {"data": [0.0, 500, 1500, "sub-login"], "isController": false}, {"data": [0.005, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.055, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.065, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.0, 500, 1500, "menu"], "isController": false}, {"data": [0.0, 500, 1500, "userProfile"], "isController": false}, {"data": [0.0, 500, 1500, "referral_page"], "isController": false}, {"data": [0.0, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.0, 500, 1500, "updateModal"], "isController": false}, {"data": [0.005, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.475, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.49, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.035, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "getResults"], "isController": false}, {"data": [0.03, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2000, 0, 0.0, 7049.073499999985, 5, 37666, 4302.0, 17444.600000000028, 26694.799999999945, 33046.57, 17.165613842351, 95.83743251768058, 4.674201678260609], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 100, 0, 0.0, 16694.6, 295, 33057, 16689.5, 30005.2, 32040.0, 33056.98, 1.9837333862328903, 0.39907136480856975, 0.5036823050981948], "isController": false}, {"data": ["test-state", 100, 0, 0.0, 4351.710000000002, 5, 8053, 4409.5, 7739.4000000000015, 7840.95, 8052.91, 10.284891494394735, 3.1135901984984056, 2.752011981898591], "isController": false}, {"data": ["getTestState", 100, 0, 0.0, 3548.520000000001, 1680, 6574, 3397.0, 5447.0, 5813.249999999996, 6572.869999999999, 6.91323885240235, 1.6743000345661943, 1.7755681818181819], "isController": false}, {"data": ["sub-login", 100, 0, 0.0, 20127.979999999992, 3303, 37666, 19972.0, 34168.100000000006, 35687.9, 37656.63999999999, 2.6493575307987816, 0.8822567558617036, 0.6796999188634256], "isController": false}, {"data": ["getQuestionWiseAnalysis", 100, 0, 0.0, 4866.100000000002, 521, 8350, 4845.5, 8024.800000000001, 8193.3, 8349.47, 7.776049766718508, 224.2499605122473, 2.0655132192846035], "isController": false}, {"data": ["sub-user-1", 100, 0, 0.0, 8812.39, 496, 19360, 9690.5, 14571.4, 15478.999999999998, 19335.76999999999, 4.341031429067547, 91.36323817882878, 1.1064542997916305], "isController": false}, {"data": ["extras", 100, 0, 0.0, 3813.0800000000004, 946, 7671, 3841.0, 6217.9, 6429.099999999999, 7660.929999999995, 6.004202942059442, 6.856811486790753, 1.5127776943860702], "isController": false}, {"data": ["testLeaderboard", 100, 0, 0.0, 8614.739999999996, 3217, 9977, 8803.0, 9642.0, 9870.3, 9976.55, 4.527345164795364, 40.79916130930822, 1.1893123528612821], "isController": false}, {"data": ["menu", 100, 0, 0.0, 2345.599999999999, 1934, 3552, 2339.5, 2634.5, 2646.95, 3546.399999999997, 10.332713370531101, 5.253236238117379, 2.5932688830336845], "isController": false}, {"data": ["userProfile", 100, 0, 0.0, 11072.92, 2476, 16557, 10308.0, 15706.7, 16156.05, 16556.41, 3.997441637352095, 5.357977144627439, 1.0149754157339304], "isController": false}, {"data": ["referral_page", 100, 0, 0.0, 2324.3, 1747, 4396, 2270.5, 2777.3, 2854.7, 4384.7899999999945, 9.5047999239616, 164.41233975501376, 2.4690202927478375], "isController": false}, {"data": ["get-priority", 100, 0, 0.0, 4165.339999999999, 1814, 6233, 4206.0, 5930.9, 5994.05, 6232.91, 9.512937595129376, 4.117875701579147, 2.536164026826484], "isController": false}, {"data": ["sub-user", 100, 0, 0.0, 25506.929999999993, 15950, 35314, 25945.5, 32188.2, 33512.99999999999, 35302.2, 1.782721859735444, 37.87857421805362, 0.9070293837130531], "isController": false}, {"data": ["updateModal", 100, 0, 0.0, 3813.5799999999986, 1970, 5728, 3831.5, 4954.8, 5444.199999999998, 5725.739999999999, 9.374707040404989, 11.72817963696447, 2.380296709477829], "isController": false}, {"data": ["olympiadTestCard", 100, 0, 0.0, 3478.4499999999994, 1453, 4599, 3364.0, 4337.200000000001, 4545.449999999999, 4598.7, 10.345541071798054, 16.431224782743637, 2.6874159424787916], "isController": false}, {"data": ["checkLQLiveUpsell", 100, 0, 0.0, 1384.7100000000003, 939, 2957, 1374.5, 1445.5, 1553.0499999999988, 2946.2099999999946, 14.645577035735208, 3.9763313744874047, 3.9188360427650846], "isController": false}, {"data": ["moengageAttributes", 100, 0, 0.0, 1100.1900000000003, 764, 6471, 959.5, 1299.8, 1317.0, 6447.599999999988, 9.669309611293754, 2.3229005511506475, 2.5684103654999033], "isController": false}, {"data": ["dashboardUpsell", 100, 0, 0.0, 3179.71, 1210, 4490, 3289.0, 4384.0, 4438.55, 4489.89, 11.940298507462687, 3.06669776119403, 3.136660447761194], "isController": false}, {"data": ["getResults", 100, 0, 0.0, 6669.819999999999, 4962, 9027, 6624.5, 6766.6, 7400.649999999996, 9019.079999999996, 4.1958628792011075, 24.359811304179082, 1.0858434208870056], "isController": false}, {"data": ["getQuestionsSummary", 100, 0, 0.0, 5110.799999999999, 1355, 9778, 5123.5, 8494.300000000001, 9109.299999999996, 9776.38, 4.646840148698885, 1.4112961779739777, 1.2433927741635689], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
