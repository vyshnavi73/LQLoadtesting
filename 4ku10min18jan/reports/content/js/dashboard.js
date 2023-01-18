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

    var data = {"OkPercent": 99.99791666666667, "KoPercent": 0.0020833333333333333};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9234166666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.950875, 500, 1500, "Content Dashboard Home"], "isController": false}, {"data": [0.9615, 500, 1500, "Moengage Attributes"], "isController": false}, {"data": [0.943375, 500, 1500, "Test Dashboard"], "isController": false}, {"data": [0.950875, 500, 1500, "Send OTP Result"], "isController": false}, {"data": [0.755375, 500, 1500, "Result Login Validation"], "isController": false}, {"data": [0.96375, 500, 1500, "Priority API"], "isController": false}, {"data": [0.953375, 500, 1500, "App Olympiad Dashboard"], "isController": false}, {"data": [0.96875, 500, 1500, "Lotte Popup"], "isController": false}, {"data": [0.747875, 500, 1500, "Submit OTP Result"], "isController": false}, {"data": [0.963625, 500, 1500, "userProfile"], "isController": false}, {"data": [0.971125, 500, 1500, "Dashboard Notification"], "isController": false}, {"data": [0.9505, 500, 1500, "Content Dashboard Performance"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 48000, 1, 0.0020833333333333333, 279.10245833333386, 12, 5047, 126.0, 493.0, 662.0, 1422.0, 79.64967418305154, 140.33622941916718, 23.75014830603396], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Content Dashboard Home", 4000, 0, 0.0, 271.3055000000005, 114, 4569, 163.0, 388.0, 735.6499999999987, 2496.459999999988, 6.68408986090409, 23.061415506420065, 2.043086060999004], "isController": false}, {"data": ["Moengage Attributes", 4000, 0, 0.0, 178.2627499999995, 47, 4475, 72.0, 268.0, 548.8999999999996, 3035.5099999999456, 6.685486310631093, 5.686580641171564, 2.02392651981996], "isController": false}, {"data": ["Test Dashboard", 4000, 0, 0.0, 265.84124999999915, 90, 4689, 143.0, 419.9000000000001, 782.9499999999998, 2635.9699999999993, 6.686939237454884, 72.55720885484493, 2.043957013011112], "isController": false}, {"data": ["Send OTP Result", 4000, 1, 0.025, 363.89999999999964, 253, 4497, 277.0, 417.0, 735.6999999999989, 2405.08999999998, 6.6878001150301625, 1.707918180303927, 1.8156332343538915], "isController": false}, {"data": ["Result Login Validation", 4000, 0, 0.0, 637.3784999999995, 313, 5022, 475.0, 996.9000000000001, 1407.749999999999, 3753.809999999996, 6.666644444518519, 1.914056119812934, 1.8749937500208333], "isController": false}, {"data": ["Priority API", 4000, 0, 0.0, 134.16499999999976, 24, 4478, 38.0, 214.0, 550.6999999999989, 2092.9699999999993, 6.68823622850359, 2.1619201090182503, 2.0312904951802895], "isController": false}, {"data": ["App Olympiad Dashboard", 4000, 0, 0.0, 229.29825000000054, 72, 4501, 115.0, 354.0, 738.2999999999975, 2617.629999999992, 6.6842685739113, 5.032784248521106, 2.0431406871428095], "isController": false}, {"data": ["Lotte Popup", 4000, 0, 0.0, 113.29875000000023, 15, 4206, 24.0, 187.9000000000001, 444.7999999999993, 2218.5999999999913, 6.682638171897501, 3.752457957852601, 1.9708561796025834], "isController": false}, {"data": ["Submit OTP Result", 4000, 0, 0.0, 635.1919999999988, 309, 5047, 482.0, 1025.9, 1408.9499999999998, 3208.2399999999834, 6.677082916015651, 2.6604002243499862, 1.9366148691959457], "isController": false}, {"data": ["userProfile", 4000, 0, 0.0, 165.50350000000006, 61, 4462, 79.0, 214.9000000000001, 533.5499999999984, 2048.6899999999932, 6.681789784211599, 9.115334817177878, 1.9449489427738111], "isController": false}, {"data": ["Dashboard Notification", 4000, 0, 0.0, 101.44650000000023, 12, 4300, 21.0, 163.0, 422.9499999999998, 1855.4299999999876, 6.686123285427261, 3.2908263045462296, 2.0959429439669437], "isController": false}, {"data": ["Content Dashboard Performance", 4000, 0, 0.0, 253.63749999999908, 95, 4647, 143.5, 403.0, 754.7499999999991, 2395.869999999997, 6.684972349283121, 10.406099535895795, 2.089053859150975], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 1, 100.0, 0.0020833333333333333], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 48000, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Send OTP Result", 4000, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
