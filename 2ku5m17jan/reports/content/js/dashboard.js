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

    var data = {"OkPercent": 79.90833333333333, "KoPercent": 20.091666666666665};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.1449375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.10825, 500, 1500, "Content Dashboard Home"], "isController": false}, {"data": [0.2975, 500, 1500, "Moengage Attributes"], "isController": false}, {"data": [0.391, 500, 1500, "Test Dashboard"], "isController": false}, {"data": [0.02775, 500, 1500, "Send OTP Result"], "isController": false}, {"data": [0.01725, 500, 1500, "Result Login Validation"], "isController": false}, {"data": [0.33675, 500, 1500, "Priority API"], "isController": false}, {"data": [0.078, 500, 1500, "App Olympiad Dashboard"], "isController": false}, {"data": [0.05525, 500, 1500, "Lotte Popup"], "isController": false}, {"data": [0.014, 500, 1500, "Submit OTP Result"], "isController": false}, {"data": [0.0455, 500, 1500, "userProfile"], "isController": false}, {"data": [0.173, 500, 1500, "Dashboard Notification"], "isController": false}, {"data": [0.195, 500, 1500, "Content Dashboard Performance"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 24000, 4822, 20.091666666666665, 23811.3500833332, 15, 67340, 21377.5, 60009.0, 60019.0, 63047.0, 41.5570023548968, 62.105715765254885, 12.391624762454114], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Content Dashboard Home", 2000, 387, 19.35, 23617.22749999997, 142, 67328, 17801.0, 60005.9, 60025.95, 67028.88000000003, 3.6166757686340176, 10.26325874749545, 1.1054878081859838], "isController": false}, {"data": ["Moengage Attributes", 2000, 385, 19.25, 19106.998999999993, 53, 67293, 10325.5, 60002.0, 60035.5, 63048.99, 3.6255068911822237, 2.683468138932143, 1.0975655627602434], "isController": false}, {"data": ["Test Dashboard", 2000, 338, 16.9, 16899.621499999983, 99, 67305, 6921.0, 60002.0, 60031.9, 67127.97, 3.679588769159159, 33.355576399531586, 1.1247180515105633], "isController": false}, {"data": ["Send OTP Result", 2000, 442, 22.1, 29652.729499999998, 323, 60162, 25310.0, 60003.0, 60010.0, 60025.0, 4.8247296342131225, 1.2657894931259663, 1.3098387092883281], "isController": false}, {"data": ["Result Login Validation", 2000, 434, 21.7, 28586.656500000012, 439, 60170, 24167.5, 60011.0, 60014.0, 60041.99, 5.577680354294256, 1.5990403426647926, 1.5687225996452596], "isController": false}, {"data": ["Priority API", 2000, 369, 18.45, 18110.693, 26, 67316, 10001.0, 60002.0, 60047.25, 67134.96, 3.64721243553552, 1.1533044912913684, 1.107698308058151], "isController": false}, {"data": ["App Olympiad Dashboard", 2000, 421, 21.05, 24632.271500000024, 85, 67287, 18608.5, 60008.0, 60017.95, 63041.98, 3.605000135187505, 2.3593405694323026, 1.101918986634462], "isController": false}, {"data": ["Lotte Popup", 2000, 428, 21.4, 26248.126499999984, 17, 67287, 20982.5, 60007.0, 60013.0, 63006.37000000002, 3.792900070358296, 1.9054803968700986, 1.1186092004377006], "isController": false}, {"data": ["Submit OTP Result", 2000, 442, 22.1, 29424.579499999996, 391, 67258, 25119.0, 60009.0, 60014.0, 60039.99, 4.2443290458536085, 1.5848424133679389, 1.2310212174009003], "isController": false}, {"data": ["userProfile", 2000, 423, 21.15, 26545.538000000026, 76, 67237, 20890.5, 60008.0, 60012.0, 60119.76, 3.9688603219142613, 4.50264878017078, 1.1553201239326247], "isController": false}, {"data": ["Dashboard Notification", 2000, 364, 18.2, 21451.462499999976, 15, 67340, 13731.0, 60002.0, 60016.9, 67099.92, 3.589923085897885, 1.6316480888146971, 1.1253567486066611], "isController": false}, {"data": ["Content Dashboard Performance", 2000, 389, 19.45, 21460.295999999926, 106, 67266, 13701.0, 60002.0, 60019.9, 63068.86, 3.60599460543207, 4.710115643120123, 1.126873314197522], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 4822, 100.0, 20.091666666666665], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 24000, 4822, "504/Gateway Time-out", 4822, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Content Dashboard Home", 2000, 387, "504/Gateway Time-out", 387, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Moengage Attributes", 2000, 385, "504/Gateway Time-out", 385, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Test Dashboard", 2000, 338, "504/Gateway Time-out", 338, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Send OTP Result", 2000, 442, "504/Gateway Time-out", 442, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Result Login Validation", 2000, 434, "504/Gateway Time-out", 434, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Priority API", 2000, 369, "504/Gateway Time-out", 369, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["App Olympiad Dashboard", 2000, 421, "504/Gateway Time-out", 421, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Lotte Popup", 2000, 428, "504/Gateway Time-out", 428, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Submit OTP Result", 2000, 442, "504/Gateway Time-out", 442, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["userProfile", 2000, 423, "504/Gateway Time-out", 423, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Dashboard Notification", 2000, 364, "504/Gateway Time-out", 364, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Content Dashboard Performance", 2000, 389, "504/Gateway Time-out", 389, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
