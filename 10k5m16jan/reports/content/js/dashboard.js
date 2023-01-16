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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8846666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9415, 500, 1500, "Content Dashboard Home"], "isController": false}, {"data": [0.969, 500, 1500, "Moengage Attributes"], "isController": false}, {"data": [0.945, 500, 1500, "Test Dashboard"], "isController": false}, {"data": [0.842, 500, 1500, "Send OTP Result"], "isController": false}, {"data": [0.5735, 500, 1500, "Result Login Validation"], "isController": false}, {"data": [0.968, 500, 1500, "Priority API"], "isController": false}, {"data": [0.9565, 500, 1500, "App Olympiad Dashboard"], "isController": false}, {"data": [0.9715, 500, 1500, "Lotte Popup"], "isController": false}, {"data": [0.562, 500, 1500, "Submit OTP Result"], "isController": false}, {"data": [0.9675, 500, 1500, "userProfile"], "isController": false}, {"data": [0.9775, 500, 1500, "Dashboard Notification"], "isController": false}, {"data": [0.942, 500, 1500, "Content Dashboard Performance"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12000, 0, 0.0, 323.1972499999994, 14, 3062, 211.0, 731.0, 948.9499999999989, 1504.949999999999, 39.59990892020948, 69.20236837361524, 11.811007990931621], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Content Dashboard Home", 1000, 0, 0.0, 313.24000000000035, 125, 1823, 250.0, 563.2999999999998, 776.6999999999982, 1232.7000000000003, 3.3389539057413313, 11.520043114242307, 1.0205982153291373], "isController": false}, {"data": ["Moengage Attributes", 1000, 0, 0.0, 178.7840000000002, 51, 1584, 112.0, 384.9, 589.0, 1100.8700000000001, 3.343877694329452, 2.8377243323948185, 1.0123067238692678], "isController": false}, {"data": ["Test Dashboard", 1000, 0, 0.0, 287.82600000000025, 97, 2964, 216.0, 510.79999999999995, 711.5999999999995, 1195.7600000000002, 3.342614660039376, 36.2693276247046, 1.0217171763596922], "isController": false}, {"data": ["Send OTP Result", 1000, 0, 0.0, 504.0080000000001, 275, 3028, 436.0, 694.0, 983.1999999999989, 1720.2200000000007, 3.3296596088981825, 0.8511247278003269, 0.9039505578844674], "isController": false}, {"data": ["Result Login Validation", 1000, 0, 0.0, 753.9370000000002, 345, 3047, 664.0, 1191.8, 1459.4999999999993, 2071.6200000000003, 3.325131342688036, 0.9546763815920729, 0.9351931901310101], "isController": false}, {"data": ["Priority API", 1000, 0, 0.0, 142.6940000000001, 26, 2409, 60.0, 350.79999999999995, 570.9499999999999, 1096.8200000000002, 3.3439559667878296, 1.0809076416081753, 1.0155960016318504], "isController": false}, {"data": ["App Olympiad Dashboard", 1000, 0, 0.0, 248.4540000000001, 80, 2614, 179.5, 470.5999999999999, 647.7999999999997, 1252.98, 3.339154592840185, 2.51414862410135, 1.0206595581630644], "isController": false}, {"data": ["Lotte Popup", 1000, 0, 0.0, 115.74399999999991, 16, 1421, 37.0, 321.69999999999993, 532.7999999999997, 1027.3000000000006, 3.340169547006206, 1.8755834858677425, 0.9850890656209709], "isController": false}, {"data": ["Submit OTP Result", 1000, 0, 0.0, 760.1860000000004, 346, 3062, 671.0, 1155.6999999999998, 1393.0, 1998.7900000000002, 3.3335222329265326, 1.3282002646816653, 0.9668516632609181], "isController": false}, {"data": ["userProfile", 1000, 0, 0.0, 184.383, 60, 1789, 120.0, 383.4999999999999, 588.299999999999, 1242.5300000000004, 3.338184828617591, 3.9966939452003576, 0.9747238903873628], "isController": false}, {"data": ["Dashboard Notification", 1000, 0, 0.0, 92.66200000000008, 14, 1336, 31.0, 251.69999999999993, 456.3999999999992, 866.0, 3.3433522455625355, 1.6455561833628105, 1.0480625691655996], "isController": false}, {"data": ["Content Dashboard Performance", 1000, 0, 0.0, 296.44899999999996, 104, 1916, 232.0, 534.4999999999999, 717.8499999999998, 1144.2800000000007, 3.342871660471211, 5.190591738426979, 1.0446473938972536], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
