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

    var data = {"OkPercent": 99.99833333333333, "KoPercent": 0.0016666666666666668};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7236083333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.74185, 500, 1500, "Content Dashboard Home"], "isController": false}, {"data": [0.7802, 500, 1500, "Moengage Attributes"], "isController": false}, {"data": [0.7419, 500, 1500, "Test Dashboard"], "isController": false}, {"data": [0.73275, 500, 1500, "Send OTP Result"], "isController": false}, {"data": [0.51745, 500, 1500, "Result Login Validation"], "isController": false}, {"data": [0.7827, 500, 1500, "Priority API"], "isController": false}, {"data": [0.755, 500, 1500, "App Olympiad Dashboard"], "isController": false}, {"data": [0.7919, 500, 1500, "Lotte Popup"], "isController": false}, {"data": [0.5196, 500, 1500, "Submit OTP Result"], "isController": false}, {"data": [0.78305, 500, 1500, "userProfile"], "isController": false}, {"data": [0.796, 500, 1500, "Dashboard Notification"], "isController": false}, {"data": [0.7409, 500, 1500, "Content Dashboard Performance"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 120000, 2, 0.0016666666666666668, 999.2239250000046, 13, 20743, 300.0, 1560.9000000000015, 2916.9500000000007, 3874.930000000011, 99.61606309017328, 175.5326257198817, 29.70400620654768], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Content Dashboard Home", 10000, 0, 0.0, 1003.9099000000037, 114, 19962, 293.5, 2558.5999999999985, 3780.0, 11736.739999999907, 8.332833363331533, 28.749902610010068, 2.5470476979714554], "isController": false}, {"data": ["Moengage Attributes", 10000, 0, 0.0, 878.5546000000035, 48, 19954, 182.0, 2316.699999999999, 3597.899999999998, 12374.439999999966, 8.333604175469036, 7.0884465203452445, 2.522868451558009], "isController": false}, {"data": ["Test Dashboard", 10000, 0, 0.0, 1002.9391999999962, 91, 20405, 302.5, 2513.7999999999993, 3833.399999999987, 12190.139999999981, 8.333451390561367, 90.42283046926498, 2.5472366066852614], "isController": false}, {"data": ["Send OTP Result", 10000, 0, 0.0, 1050.1432, 255, 20368, 359.0, 2471.8999999999996, 3758.949999999999, 11346.96, 8.333444445925947, 2.129820064267524, 2.2623999569994266], "isController": false}, {"data": ["Result Login Validation", 10000, 0, 0.0, 1385.513300000004, 309, 20743, 684.0, 2973.0, 4319.899999999998, 13026.98, 8.323989654945658, 2.3898954673379134, 2.341122090453466], "isController": false}, {"data": ["Priority API", 10000, 0, 0.0, 843.2268000000024, 24, 20239, 141.0, 2306.8999999999996, 3517.949999999999, 12395.649999999992, 8.334006998899078, 2.693902652964448, 2.5311290787672003], "isController": false}, {"data": ["App Olympiad Dashboard", 10000, 0, 0.0, 974.1214999999972, 74, 20305, 250.0, 2511.699999999999, 3970.899999999998, 12444.779999999995, 8.334284830851523, 6.2751304732290265, 2.5474913594302016], "isController": false}, {"data": ["Lotte Popup", 10000, 0, 0.0, 824.2620999999995, 14, 20237, 123.0, 2254.0, 3632.5999999999913, 11205.959999999955, 8.334215371126778, 4.6798572640604466, 2.45794242390653], "isController": false}, {"data": ["Submit OTP Result", 10000, 0, 0.0, 1354.7120000000002, 318, 20625, 681.5, 2785.399999999994, 4234.0, 11976.609999999991, 8.330389928891792, 3.319139737292823, 2.416138485235217], "isController": false}, {"data": ["userProfile", 10000, 2, 0.02, 860.2477000000022, 60, 20215, 160.0, 2333.7999999999993, 3593.0, 10772.929999999998, 8.330792441638634, 11.380582470523574, 2.425172594494096], "isController": false}, {"data": ["Dashboard Notification", 10000, 0, 0.0, 785.1693999999962, 13, 20152, 98.0, 2203.7999999999993, 3487.899999999998, 11071.439999999988, 8.33393754380526, 4.101859884841651, 2.6124940933217657], "isController": false}, {"data": ["Content Dashboard Performance", 10000, 0, 0.0, 1027.887400000006, 96, 20262, 295.0, 2595.699999999999, 3980.7499999999945, 13086.989999999978, 8.332805588979364, 12.97118370003233, 2.6040017465560514], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 2, 100.0, 0.0016666666666666668], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 120000, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["userProfile", 10000, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
