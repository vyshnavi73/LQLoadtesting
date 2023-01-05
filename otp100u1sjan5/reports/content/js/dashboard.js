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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.04340909090909091, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.005, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.095, 500, 1500, "test-state"], "isController": false}, {"data": [0.0, 500, 1500, "getTestState"], "isController": false}, {"data": [0.015, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.0, 500, 1500, "Send OTP Result"], "isController": false}, {"data": [0.06, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "Result Login Validation"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.0, 500, 1500, "menu"], "isController": false}, {"data": [0.0, 500, 1500, "Submit OTP Result"], "isController": false}, {"data": [0.0, 500, 1500, "userProfile"], "isController": false}, {"data": [0.0, 500, 1500, "referral_page"], "isController": false}, {"data": [0.0, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.0, 500, 1500, "updateModal"], "isController": false}, {"data": [0.0, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.26, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.49, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.0, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "getResults"], "isController": false}, {"data": [0.03, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2200, 0, 0.0, 11662.256363636361, 191, 44361, 6046.5, 34220.3, 39510.25, 42974.259999999966, 10.166452555014372, 75.59209206675894, 2.72799208518563], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 100, 0, 0.0, 20767.97000000001, 1299, 41813, 20196.0, 37748.4, 40260.0, 41812.09, 1.9113149847094801, 0.38450281918960244, 0.48529482033639143], "isController": false}, {"data": ["test-state", 100, 0, 0.0, 3875.6700000000014, 191, 7397, 3848.5, 6706.7, 7169.45, 7396.95, 12.280486307257767, 3.717725346923738, 3.285989500184207], "isController": false}, {"data": ["getTestState", 100, 0, 0.0, 3629.4900000000007, 1661, 6113, 3426.0, 5735.8, 5885.8, 6112.07, 9.73141300116777, 2.3568265862203193, 2.48987324834566], "isController": false}, {"data": ["getQuestionWiseAnalysis", 100, 0, 0.0, 4504.48, 1399, 7776, 4427.0, 7121.800000000001, 7389.8, 7774.329999999999, 10.625863351397301, 254.3254735150356, 2.8121181330358094], "isController": false}, {"data": ["sub-user-1", 100, 0, 0.0, 20079.000000000004, 2546, 37419, 19836.0, 34441.4, 36249.8, 37416.57, 2.4033839646221877, 121.35915494015575, 0.6125812644203038], "isController": false}, {"data": ["Send OTP Result", 100, 0, 0.0, 30662.019999999993, 26378, 35035, 31183.0, 33709.4, 34287.049999999996, 35030.79, 1.6507370540946533, 0.4073483849601347, 0.38527944914904505], "isController": false}, {"data": ["extras", 100, 0, 0.0, 3978.609999999999, 872, 7505, 3942.5, 6593.000000000001, 6827.65, 7502.749999999999, 8.949346697691068, 10.312723733667443, 2.2460762708072313], "isController": false}, {"data": ["Result Login Validation", 100, 0, 0.0, 20826.79, 3555, 38344, 21002.5, 35199.700000000004, 36515.35, 38337.32, 2.6076299251610213, 0.723209862056377, 0.634081886098725], "isController": false}, {"data": ["testLeaderboard", 100, 0, 0.0, 7160.549999999998, 4534, 7635, 7210.0, 7419.5, 7491.85, 7634.75, 6.516356053694773, 42.89085918154568, 1.7054525609279292], "isController": false}, {"data": ["menu", 100, 0, 0.0, 2580.629999999999, 2192, 2855, 2643.5, 2792.2, 2810.5499999999997, 2854.79, 14.664906877841325, 7.762089382607421, 3.6662267194603313], "isController": false}, {"data": ["Submit OTP Result", 100, 0, 0.0, 35941.25, 27122, 43692, 35835.0, 42284.0, 42785.3, 43691.54, 1.4343909575994032, 0.5575074229732057, 0.3613992842389122], "isController": false}, {"data": ["userProfile", 100, 0, 0.0, 21585.620000000006, 4315, 36581, 22131.0, 33766.1, 35607.7, 36580.55, 2.3053692048781613, 3.0640698123429466, 0.5830963125619568], "isController": false}, {"data": ["referral_page", 100, 0, 0.0, 2954.2399999999993, 2189, 5847, 2997.5, 3265.1, 3332.2, 5841.689999999997, 10.191602119853242, 175.97433308703629, 2.637475157969833], "isController": false}, {"data": ["get-priority", 100, 0, 0.0, 4628.29, 1764, 7060, 4567.5, 6705.6, 6908.7, 7059.41, 10.116337885685383, 4.53456942336874, 2.6871522508851795], "isController": false}, {"data": ["sub-user", 100, 0, 0.0, 40846.929999999986, 38438, 44361, 40148.0, 43583.5, 43989.45, 44360.73, 1.1987101878378865, 60.77015818479316, 0.6098906326792372], "isController": false}, {"data": ["updateModal", 100, 0, 0.0, 4695.680000000002, 2775, 6882, 4742.0, 6323.2, 6515.299999999999, 6881.03, 9.17094644167278, 11.490551059244314, 2.3196046175715335], "isController": false}, {"data": ["olympiadTestCard", 100, 0, 0.0, 7460.849999999999, 3519, 11827, 7387.5, 10938.2, 11432.15, 11824.96, 6.19348445435402, 9.70756108324043, 1.6028060355506006], "isController": false}, {"data": ["checkLQLiveUpsell", 100, 0, 0.0, 1496.5099999999998, 690, 1926, 1495.0, 1837.8, 1858.95, 1925.6999999999998, 29.931158335827597, 8.155071460640526, 7.979693579766536], "isController": false}, {"data": ["moengageAttributes", 100, 0, 0.0, 825.7299999999998, 645, 3373, 672.5, 1060.6, 1112.6499999999999, 3367.109999999997, 20.885547201336674, 5.017426378446115, 5.527327433166248], "isController": false}, {"data": ["dashboardUpsell", 100, 0, 0.0, 6643.539999999999, 1526, 11506, 6700.5, 10645.9, 11204.749999999996, 11505.55, 7.085665698292354, 1.819853592432509, 1.8544515694749522], "isController": false}, {"data": ["getResults", 100, 0, 0.0, 7342.459999999999, 6833, 7678, 7357.5, 7653.5, 7667.9, 7677.99, 5.665401393688743, 31.690839045946404, 1.460611296810379], "isController": false}, {"data": ["getQuestionsSummary", 100, 0, 0.0, 4083.3300000000013, 1201, 6923, 4092.0, 6428.500000000001, 6677.8, 6922.339999999999, 8.4774499830451, 2.5746942819599865, 2.2601014114954223], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2200, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
