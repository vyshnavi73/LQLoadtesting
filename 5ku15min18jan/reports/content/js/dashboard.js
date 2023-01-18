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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9501666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9767, 500, 1500, "Content Dashboard Home"], "isController": false}, {"data": [0.984, 500, 1500, "Moengage Attributes"], "isController": false}, {"data": [0.9728, 500, 1500, "Test Dashboard"], "isController": false}, {"data": [0.9707, 500, 1500, "Send OTP Result"], "isController": false}, {"data": [0.7995, 500, 1500, "Result Login Validation"], "isController": false}, {"data": [0.9872, 500, 1500, "Priority API"], "isController": false}, {"data": [0.9785, 500, 1500, "App Olympiad Dashboard"], "isController": false}, {"data": [0.987, 500, 1500, "Lotte Popup"], "isController": false}, {"data": [0.7975, 500, 1500, "Submit OTP Result"], "isController": false}, {"data": [0.9869, 500, 1500, "userProfile"], "isController": false}, {"data": [0.9868, 500, 1500, "Dashboard Notification"], "isController": false}, {"data": [0.9744, 500, 1500, "Content Dashboard Performance"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 60000, 0, 0.0, 223.99755000000067, 13, 7987, 124.0, 474.0, 662.9500000000007, 1185.9900000000016, 66.55263981045809, 117.26711077901805, 19.844787241956002], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Content Dashboard Home", 5000, 0, 0.0, 212.84720000000004, 113, 7091, 156.0, 299.90000000000055, 430.9499999999998, 1184.949999999999, 5.5686790759111195, 19.213030444525376, 1.7021450691017386], "isController": false}, {"data": ["Moengage Attributes", 5000, 0, 0.0, 115.43819999999988, 47, 5859, 69.0, 148.0, 287.0, 1019.6999999999935, 5.569510272961698, 4.737347116943007, 1.6860822115411391], "isController": false}, {"data": ["Test Dashboard", 5000, 0, 0.0, 201.4848000000003, 90, 6332, 134.0, 300.90000000000055, 480.0, 1307.9299999999985, 5.570285867070698, 60.44086549709231, 1.7026362074151646], "isController": false}, {"data": ["Send OTP Result", 5000, 0, 0.0, 326.6002, 253, 6126, 272.0, 313.0, 479.7499999999991, 1675.8499999999967, 5.559818082752332, 1.4209005550088403, 1.5094037373097153], "isController": false}, {"data": ["Result Login Validation", 5000, 0, 0.0, 572.4104000000002, 305, 7987, 450.0, 975.9000000000005, 1191.8999999999996, 2120.4699999999884, 5.5547964000475485, 1.5948341226699017, 1.562286487513373], "isController": false}, {"data": ["Priority API", 5000, 0, 0.0, 78.65339999999988, 24, 5650, 37.0, 93.0, 233.94999999999982, 944.8299999999963, 5.569696395849462, 1.800360846705246, 1.6915777139738113], "isController": false}, {"data": ["App Olympiad Dashboard", 5000, 0, 0.0, 166.78219999999993, 73, 5124, 108.0, 243.90000000000055, 403.9499999999998, 1249.7399999999943, 5.569063628779584, 4.193113337684628, 1.7022626130937597], "isController": false}, {"data": ["Lotte Popup", 5000, 0, 0.0, 63.603799999999694, 15, 6124, 23.0, 70.0, 213.94999999999982, 769.9599999999991, 5.569491661357085, 3.1274001028128158, 1.6425649235642963], "isController": false}, {"data": ["Submit OTP Result", 5000, 0, 0.0, 573.5858000000001, 313, 6893, 452.0, 955.0, 1165.0, 2269.909999999998, 5.560999155840328, 2.2157106011551306, 1.6129069817232202], "isController": false}, {"data": ["userProfile", 5000, 0, 0.0, 113.87319999999978, 60, 5153, 75.0, 126.0, 256.0, 767.909999999998, 5.563307096777065, 7.5952582907879425, 1.6193254876099588], "isController": false}, {"data": ["Dashboard Notification", 5000, 0, 0.0, 58.61600000000008, 13, 4181, 20.0, 58.0, 188.0, 876.359999999986, 5.569510272961698, 2.741243337473336, 1.74591093517647], "isController": false}, {"data": ["Content Dashboard Performance", 5000, 0, 0.0, 204.07539999999955, 95, 5545, 137.0, 295.0, 450.89999999999964, 1283.8699999999972, 5.568889953165636, 8.668760337251975, 1.740278110364261], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 60000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
