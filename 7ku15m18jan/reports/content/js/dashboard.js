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

    var data = {"OkPercent": 99.99761904761905, "KoPercent": 0.002380952380952381};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6772678571428571, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7065, 500, 1500, "Content Dashboard Home"], "isController": false}, {"data": [0.7332142857142857, 500, 1500, "Moengage Attributes"], "isController": false}, {"data": [0.7007142857142857, 500, 1500, "Test Dashboard"], "isController": false}, {"data": [0.6867857142857143, 500, 1500, "Send OTP Result"], "isController": false}, {"data": [0.488, 500, 1500, "Result Login Validation"], "isController": false}, {"data": [0.7281428571428571, 500, 1500, "Priority API"], "isController": false}, {"data": [0.6976428571428571, 500, 1500, "App Olympiad Dashboard"], "isController": false}, {"data": [0.7295, 500, 1500, "Lotte Popup"], "isController": false}, {"data": [0.5018571428571429, 500, 1500, "Submit OTP Result"], "isController": false}, {"data": [0.7202142857142857, 500, 1500, "userProfile"], "isController": false}, {"data": [0.7372142857142857, 500, 1500, "Dashboard Notification"], "isController": false}, {"data": [0.6974285714285714, 500, 1500, "Content Dashboard Performance"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 84000, 2, 0.002380952380952381, 1366.7840714285696, 13, 27964, 181.0, 876.0, 1688.9000000000015, 8395.970000000005, 91.51622778824887, 161.26024322956954, 27.288372766227788], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Content Dashboard Home", 7000, 0, 0.0, 1310.8790000000008, 115, 27467, 259.0, 4598.500000000003, 6212.9, 9114.11999999998, 7.663137244598583, 26.439320200358196, 2.342345661679059], "isController": false}, {"data": ["Moengage Attributes", 7000, 0, 0.0, 1176.0444285714373, 48, 26500, 140.0, 4310.900000000001, 5904.9, 8200.799999999996, 7.66300302141262, 6.518042609033586, 2.319854430310461], "isController": false}, {"data": ["Test Dashboard", 7000, 0, 0.0, 1342.4585714285708, 92, 26750, 254.0, 4570.0, 6137.9, 8933.739999999994, 7.666737857803918, 83.18859798638607, 2.343446239738893], "isController": false}, {"data": ["Send OTP Result", 7000, 2, 0.02857142857142857, 1422.5172857142832, 255, 26858, 332.0, 4711.900000000001, 6054.749999999999, 8343.96, 7.675312357801133, 1.96183146830096, 2.083727378387417], "isController": false}, {"data": ["Result Login Validation", 7000, 0, 0.0, 1838.6544285714365, 311, 27770, 678.0, 5105.900000000001, 6806.849999999999, 9814.0, 7.699762077351809, 2.2106738776771797, 2.1655580842551965], "isController": false}, {"data": ["Priority API", 7000, 0, 0.0, 1182.88485714286, 24, 27373, 109.0, 4194.800000000001, 5806.799999999999, 8518.769999999995, 7.664723111877584, 2.4775618652651175, 2.3278602419862584], "isController": false}, {"data": ["App Olympiad Dashboard", 7000, 0, 0.0, 1398.0374285714317, 73, 26730, 233.5, 4776.900000000001, 6421.95, 9150.739999999994, 7.662071977504157, 5.769001459624712, 2.3420200478113293], "isController": false}, {"data": ["Lotte Popup", 7000, 0, 0.0, 1186.9635714285746, 14, 26477, 87.0, 4388.900000000001, 5964.9, 8583.949999999999, 7.66280169544961, 4.3028427489096925, 2.2599278437751775], "isController": false}, {"data": ["Submit OTP Result", 7000, 0, 0.0, 1752.5128571428538, 312, 27964, 668.0, 5099.900000000001, 6763.0, 9532.739999999994, 7.658509260231768, 3.051437283373595, 2.2212668459851908], "isController": false}, {"data": ["userProfile", 7000, 0, 0.0, 1281.3617142857133, 61, 27279, 129.0, 4519.600000000002, 6159.5999999999985, 9053.399999999965, 7.662214555142769, 10.467304483886911, 2.2301566002726654], "isController": false}, {"data": ["Dashboard Notification", 7000, 0, 0.0, 1111.1078571428563, 13, 26681, 65.0, 4180.400000000003, 5696.099999999997, 8218.899999999998, 7.663162411969422, 3.7717127496411997, 2.402221810783383], "isController": false}, {"data": ["Content Dashboard Performance", 7000, 0, 0.0, 1397.9868571428665, 95, 27098, 259.0, 4645.900000000001, 6280.799999999999, 9085.809999999974, 7.662399075257895, 11.92760168550887, 2.394499711018092], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 2, 100.0, 0.002380952380952381], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 84000, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Send OTP Result", 7000, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
