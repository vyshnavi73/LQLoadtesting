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

    var data = {"OkPercent": 99.96, "KoPercent": 0.04};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [3.5E-4, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.007, 500, 1500, "test-state"], "isController": false}, {"data": [0.0, 500, 1500, "getTestState"], "isController": false}, {"data": [0.0, 500, 1500, "sub-login"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.0, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.0, 500, 1500, "menu"], "isController": false}, {"data": [0.0, 500, 1500, "userProfile"], "isController": false}, {"data": [0.0, 500, 1500, "referral_page"], "isController": false}, {"data": [0.0, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.0, 500, 1500, "updateModal"], "isController": false}, {"data": [0.0, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.0, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.0, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "getResults"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10000, 4, 0.04, 35910.356799999994, 7, 182993, 21254.0, 93914.4, 131055.4, 163709.34999999998, 17.022522499519116, 104.99880037762338, 4.635084926960611], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 500, 0, 0.0, 85877.62999999999, 7319, 165373, 85960.0, 149673.4, 157376.15, 164023.82, 2.183282171754442, 0.4392064396999297, 0.5543404604760428], "isController": false}, {"data": ["test-state", 500, 0, 0.0, 23410.10199999999, 20, 45587, 23524.5, 41433.100000000006, 43385.95, 44763.99, 5.105896289034577, 1.5457303218757021, 1.3662261554643302], "isController": false}, {"data": ["getTestState", 500, 0, 0.0, 17288.128, 6571, 82417, 16673.5, 25089.700000000004, 26558.899999999998, 67599.94000000008, 3.745514746091555, 0.9071168525690486, 0.9619608448570337], "isController": false}, {"data": ["sub-login", 500, 0, 0.0, 91889.63800000004, 8685, 167197, 92534.5, 151679.1, 158996.55, 164871.64, 2.7452616783431796, 0.9141721388882788, 0.7040791929067929], "isController": false}, {"data": ["getQuestionWiseAnalysis", 500, 0, 0.0, 25476.263999999985, 5135, 45333, 25618.0, 41790.4, 43697.35, 45064.94, 3.7027437331062316, 110.13752655561521, 0.9835196083422817], "isController": false}, {"data": ["sub-user-1", 500, 0, 0.0, 49643.906, 7317, 97392, 47523.5, 89672.3, 92295.25, 95656.78, 2.7329871549603717, 72.03957173237224, 0.6965807768515988], "isController": false}, {"data": ["extras", 500, 1, 0.2, 18705.932000000004, 9, 35317, 18637.5, 31157.600000000002, 32645.7, 33832.090000000004, 6.92444050520718, 7.895863772019721, 1.7445938512699424], "isController": false}, {"data": ["testLeaderboard", 500, 0, 0.0, 41791.46599999998, 4300, 46492, 42192.0, 45846.3, 46143.95, 46327.93, 4.00708452544098, 36.11071875075133, 1.0526423216246323], "isController": false}, {"data": ["menu", 500, 0, 0.0, 10485.366, 8502, 26915, 10159.0, 11937.9, 12212.35, 21705.720000000023, 9.34020772621983, 4.745281589750056, 2.3441185003829488], "isController": false}, {"data": ["userProfile", 500, 0, 0.0, 65300.37000000004, 10236, 95640, 68640.0, 90340.40000000001, 92702.6, 94953.76, 3.7317331661516877, 4.996951057386593, 0.9474885085941815], "isController": false}, {"data": ["referral_page", 500, 0, 0.0, 10347.397999999992, 8549, 19477, 10223.0, 11836.800000000001, 12067.75, 12247.720000000001, 10.84763413099603, 187.66676118797864, 2.817778899453279], "isController": false}, {"data": ["get-priority", 500, 0, 0.0, 18791.456000000006, 6714, 31301, 18218.5, 29522.5, 30425.149999999998, 31166.95, 7.49985000299994, 3.2446226075478486, 1.9994277848818023], "isController": false}, {"data": ["sub-user", 500, 0, 0.0, 135522.74399999986, 76195, 182993, 131392.0, 171538.7, 174085.85, 179592.97, 1.7063506960204489, 45.32143767831364, 0.868159240059654], "isController": false}, {"data": ["updateModal", 500, 0, 0.0, 22094.494000000006, 9295, 31192, 22698.0, 29845.8, 30494.5, 31090.9, 9.030650026188885, 11.297731218505609, 2.2928855692470247], "isController": false}, {"data": ["olympiadTestCard", 500, 0, 0.0, 16629.515999999996, 9786, 21215, 16763.5, 20393.4, 20710.75, 21091.0, 11.058766284033354, 17.567217427786257, 2.872622538042156], "isController": false}, {"data": ["checkLQLiveUpsell", 500, 2, 0.4, 6278.898000000004, 7, 16657, 6115.0, 6958.8, 7016.7, 13387.710000000014, 16.745930738830463, 4.552799919619533, 4.480746627788197], "isController": false}, {"data": ["moengageAttributes", 500, 1, 0.2, 4483.792000000004, 13, 28412, 4424.0, 4871.6, 5027.65, 6373.380000000003, 12.014898474107893, 2.8882454869037604, 3.1913870073891624], "isController": false}, {"data": ["dashboardUpsell", 500, 0, 0.0, 14053.039999999979, 5642, 21076, 14150.5, 19873.7, 20534.35, 21019.88, 12.179971255267837, 3.1282543360697668, 3.1995499881245277], "isController": false}, {"data": ["getResults", 500, 0, 0.0, 34660.62400000001, 5221, 45525, 34898.0, 35858.9, 36814.35, 37043.99, 4.247258394706217, 25.383922295345855, 1.0991191318816205], "isController": false}, {"data": ["getQuestionsSummary", 500, 0, 0.0, 25476.372000000032, 4864, 46105, 25316.0, 42477.100000000006, 44251.6, 45578.89, 3.116857210537471, 0.9466236254659701, 0.8339845454531287], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 4, 100.0, 0.04], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10000, 4, "500/Internal Server Error", 4, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["extras", 500, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["checkLQLiveUpsell", 500, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["moengageAttributes", 500, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
