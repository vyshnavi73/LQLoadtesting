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

    var data = {"OkPercent": 99.85416666666667, "KoPercent": 0.14583333333333334};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9265, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.957, 500, 1500, "Content Dashboard Home"], "isController": false}, {"data": [0.97075, 500, 1500, "Moengage Attributes"], "isController": false}, {"data": [0.9525, 500, 1500, "Test Dashboard"], "isController": false}, {"data": [0.95525, 500, 1500, "Send OTP Result"], "isController": false}, {"data": [0.73925, 500, 1500, "Result Login Validation"], "isController": false}, {"data": [0.974, 500, 1500, "Priority API"], "isController": false}, {"data": [0.9575, 500, 1500, "App Olympiad Dashboard"], "isController": false}, {"data": [0.9745, 500, 1500, "Lotte Popup"], "isController": false}, {"data": [0.73525, 500, 1500, "Submit OTP Result"], "isController": false}, {"data": [0.96825, 500, 1500, "userProfile"], "isController": false}, {"data": [0.9745, 500, 1500, "Dashboard Notification"], "isController": false}, {"data": [0.95925, 500, 1500, "Content Dashboard Performance"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 24000, 35, 0.14583333333333334, 260.8574999999991, 0, 6232, 133.0, 528.9000000000015, 710.0, 1277.9900000000016, 79.45362391289234, 139.79702185471243, 23.691783279688345], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Content Dashboard Home", 2000, 4, 0.2, 244.95050000000003, 30, 5386, 163.0, 396.60000000000036, 634.8999999999996, 1480.91, 6.708842925860577, 23.104154367121303, 2.0506521833929305], "isController": false}, {"data": ["Moengage Attributes", 2000, 4, 0.2, 149.87349999999967, 2, 5800, 74.0, 276.0, 505.7499999999991, 1253.4900000000005, 6.714721691572689, 5.703657718740453, 2.0327770745972007], "isController": false}, {"data": ["Test Dashboard", 2000, 3, 0.15, 241.12899999999956, 91, 4804, 146.0, 452.9000000000001, 725.0, 1539.96, 6.71781160569133, 72.78557968206277, 2.05339358650526], "isController": false}, {"data": ["Send OTP Result", 2000, 2, 0.1, 342.12200000000007, 2, 5444, 278.0, 430.9000000000001, 659.7999999999993, 1500.7100000000003, 6.68167817028925, 1.7078995810587787, 1.8139712220121205], "isController": false}, {"data": ["Result Login Validation", 2000, 5, 0.25, 629.1300000000003, 302, 5733, 491.0, 1055.9, 1348.7999999999993, 2229.8500000000004, 6.663512604034091, 1.9128803772464367, 1.874112919884588], "isController": false}, {"data": ["Priority API", 2000, 4, 0.2, 112.79349999999984, 0, 5439, 39.0, 216.9000000000001, 431.84999999999945, 1360.92, 6.717202419536311, 2.1705747490285248, 2.0400878442146415], "isController": false}, {"data": ["App Olympiad Dashboard", 2000, 2, 0.1, 217.9680000000001, 73, 5434, 119.0, 413.8000000000002, 645.5499999999984, 1573.93, 6.686056229732892, 5.030904727877512, 2.043687109283589], "isController": false}, {"data": ["Lotte Popup", 2000, 3, 0.15, 93.05550000000014, 15, 5368, 24.0, 191.9000000000001, 443.84999999999945, 1190.2900000000006, 6.686860986846945, 3.7519101958748755, 1.9721015801052513], "isController": false}, {"data": ["Submit OTP Result", 2000, 0, 0.0, 620.2505000000003, 308, 6232, 496.5, 1016.4000000000005, 1343.699999999999, 2150.83, 6.678509890873149, 2.66096878464477, 1.9370287476458252], "isController": false}, {"data": ["userProfile", 2000, 3, 0.15, 157.2589999999997, 61, 5211, 81.0, 240.9000000000001, 517.6999999999989, 1574.89, 6.685184628086466, 9.097073894688288, 1.9460317840835784], "isController": false}, {"data": ["Dashboard Notification", 2000, 3, 0.15, 85.14599999999992, 1, 4626, 21.0, 158.9000000000001, 428.34999999999764, 1169.99, 6.7124906025131565, 3.3015719341957763, 2.1042084798893783], "isController": false}, {"data": ["Content Dashboard Performance", 2000, 2, 0.1, 236.61249999999967, 95, 5372, 148.0, 414.9000000000001, 647.7499999999991, 1484.8200000000002, 6.71021596830094, 10.436764549845162, 2.096942490094044], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 35, 100.0, 0.14583333333333334], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 24000, 35, "502/Bad Gateway", 35, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Content Dashboard Home", 2000, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Moengage Attributes", 2000, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Test Dashboard", 2000, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Send OTP Result", 2000, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Result Login Validation", 2000, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Priority API", 2000, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["App Olympiad Dashboard", 2000, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Lotte Popup", 2000, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["userProfile", 2000, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Dashboard Notification", 2000, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Content Dashboard Performance", 2000, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
