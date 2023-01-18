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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.979625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.99775, 500, 1500, "Content Dashboard Home"], "isController": false}, {"data": [0.99975, 500, 1500, "Moengage Attributes"], "isController": false}, {"data": [0.9985, 500, 1500, "Test Dashboard"], "isController": false}, {"data": [0.99725, 500, 1500, "Send OTP Result"], "isController": false}, {"data": [0.8835, 500, 1500, "Result Login Validation"], "isController": false}, {"data": [0.99975, 500, 1500, "Priority API"], "isController": false}, {"data": [0.99925, 500, 1500, "App Olympiad Dashboard"], "isController": false}, {"data": [1.0, 500, 1500, "Lotte Popup"], "isController": false}, {"data": [0.882, 500, 1500, "Submit OTP Result"], "isController": false}, {"data": [0.99975, 500, 1500, "userProfile"], "isController": false}, {"data": [1.0, 500, 1500, "Dashboard Notification"], "isController": false}, {"data": [0.998, 500, 1500, "Content Dashboard Performance"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 24000, 0, 0.0, 161.16279166666683, 13, 2318, 105.0, 378.0, 469.9500000000007, 686.0, 39.86518921845958, 70.23359527998235, 11.88715349727754], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Content Dashboard Home", 2000, 0, 0.0, 155.0845000000003, 111, 1354, 143.0, 201.0, 231.94999999999982, 335.97, 3.3404038548260484, 11.525045721777763, 1.0210414126567902], "isController": false}, {"data": ["Moengage Attributes", 2000, 0, 0.0, 70.40650000000025, 47, 963, 61.0, 96.0, 120.94999999999982, 193.99, 3.347218712291489, 2.847097166411999, 1.013318164853869], "isController": false}, {"data": ["Test Dashboard", 2000, 0, 0.0, 136.44449999999995, 90, 1118, 120.0, 193.0, 238.0, 360.9100000000001, 3.3471010757582857, 36.31800786401398, 1.0230885124143978], "isController": false}, {"data": ["Send OTP Result", 2000, 0, 0.0, 269.7994999999997, 252, 1406, 262.0, 284.0, 290.0, 323.0, 3.3361245575464804, 0.8523505030458817, 0.9057056904276577], "isController": false}, {"data": ["Result Login Validation", 2000, 0, 0.0, 447.9120000000002, 299, 2318, 403.0, 606.0, 716.8999999999996, 1070.9, 3.331678599628851, 0.9565561604403147, 0.9370346061456143], "isController": false}, {"data": ["Priority API", 2000, 0, 0.0, 39.10999999999991, 24, 648, 33.0, 56.0, 74.94999999999982, 124.91000000000008, 3.347498832559782, 1.0820528452903202, 1.016672008716887], "isController": false}, {"data": ["App Olympiad Dashboard", 2000, 0, 0.0, 109.32750000000001, 72, 1227, 95.0, 161.0, 193.0, 292.98, 3.3407051560443377, 2.515316089170102, 1.0211335096112086], "isController": false}, {"data": ["Lotte Popup", 2000, 0, 0.0, 23.514500000000037, 15, 453, 20.0, 31.0, 39.0, 67.93000000000006, 3.3411237201407946, 1.876119276446247, 0.9853704721508986], "isController": false}, {"data": ["Submit OTP Result", 2000, 0, 0.0, 446.227, 305, 1853, 398.0, 615.9000000000001, 739.8999999999996, 1060.91, 3.338792258676269, 1.330300040566326, 0.9683801765887226], "isController": false}, {"data": ["userProfile", 2000, 0, 0.0, 76.34100000000004, 60, 1386, 71.0, 91.90000000000009, 104.89999999999964, 144.98000000000002, 3.3408279239761196, 4.551550162426878, 0.9725022848130974], "isController": false}, {"data": ["Dashboard Notification", 2000, 0, 0.0, 21.27499999999997, 13, 178, 18.0, 29.0, 37.0, 64.99000000000001, 3.3411125570703786, 1.6444538366830772, 1.0473604793160076], "isController": false}, {"data": ["Content Dashboard Performance", 2000, 0, 0.0, 138.5115, 94, 1412, 124.0, 187.9000000000001, 220.94999999999982, 312.99, 3.3404540679214523, 5.1998865080730425, 1.043891896225454], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 24000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
