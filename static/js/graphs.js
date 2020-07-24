// Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/coffee-flavors.csv', function(err, rows){

//     console.log(rows)

//     function unpack(rows, key) {
//         // console.log(key)
//         return rows.map(function (row) {
//             return row[key]
//         })


//     }

//     var data = [{
//         type: "sunburst",
//         maxdepth: 2,
//         ids: rows.map(d => d.ids),
//         labels: rows.map(d => d.labels),
//         parents: rows.map(d => d.parents),
//         textposition: 'inside',
//         insidetextorientation: 'radial'
//     }]

//     var layout = { margin: { l: 0, r: 0, b: 0, t: 0 } }

//     Plotly.newPlot('scatter1', data, layout)
// })


// Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/coffee-flavors.csv', function (err, rows) {
//     console.log(rows)

//     function unpack(rows, key) {
//         return rows.map(function (row) { return row[key]; });
//     }

//     var data = [
//         {
//             type: "sunburst",
//             maxdepth: 3,
//             ids: unpack(rows, 'ids'),
//             labels: unpack(rows, 'labels'),
//             parents: unpack(rows, 'parents')
//         }
//     ];

//     var layout = {
//         margin: { l: 0, r: 0, b: 0, t: 0 },
//         sunburstcolorway: [
//             "#636efa", "#EF553B", "#00cc96", "#ab63fa", "#19d3f3",
//             "#e763fa", "#FECB52", "#FFA15A", "#FF6692", "#B6E880"
//         ],
//         extendsunburstcolorway: true
//     };


//     Plotly.newPlot('scatter1', data, layout, { showSendToCloud: true });
// })


// Return an Array of profit
function getData(genre, data) {
    // console.log(data)
    // return genre == '' ? data.map(item => item.budget) :
    return genre == '' ? data :
        //data.filter(item => item.genre == genre).map(item => item.budget);
        data.filter(item => item.genre == genre);
        
};

// Index page plots 
function indexPlots(genre, data) {

    var ndata = getData(genre, data);
    // console.log(ndata)

    var budget = d3.rollup(ndata, v => d3.mean(v, d => d.budget), d => d.year_released);
    budget = Array.from(budget.entries())

    // console.log(budget)

    var domestic_gross = d3.rollup(ndata, v => d3.mean(v, d => d.domestic_gross), d => d.year_released);
    domestic_gross = Array.from(domestic_gross.entries())

    var international_gross = d3.rollup(ndata, v => d3.mean(v, d => d.international_gross), d => d.year_released);
    international_gross = Array.from(international_gross.entries())

    var world_gross = d3.rollup(ndata, v => d3.mean(v, d => d.world_gross), d => d.year_released);
    world_gross = Array.from(world_gross.entries())

    var movie_count = d3.rollup(ndata, v => d3.count(v, d => d.year_released), d => d.year_released);
    movie_count = Array.from(movie_count.entries())

    var theatres = d3.rollup(ndata, v => d3.sum(v, d => d.theatres), d => d.year_released);
    theatres = Array.from(theatres.entries())
    // console.log(theatres)

    var values = []
    values = [budget.map(d => d[0]) , budget.map(d => d[1]) , movie_count.map(d => d[1]) , theatres.map(d => d[1])]

    //Worls vs Domestic and International Time Series
    var trace1 = {
        type: "scatter",
        mode: "lines",
        name: 'Avg. World Gross Income',
        x: world_gross.map(d => d[0]),
        y: world_gross.map(d => d[1]),
        line: { color: '#17BECF' }
    }

    var trace3 = {
        type: "scatter",
        mode: "lines",
        name: 'Avg. Domestic Gross Income',
        x: world_gross.map(d => d[0]),
        y: domestic_gross.map(d => d[1]),
        line: { color: '#9acd32' }
    }

    var trace2 = {
        type: "scatter",
        mode: "lines",
        name: 'Avg. International Gross Income',
        x: world_gross.map(d => d[0]),
        y: international_gross.map(d => d[1]),
        line: { color: '#98FB98' }
    }

    var data = [trace1, trace2, trace3];

    var layout = {
        title: 'World Gross vs Domestic and International Gross Income (Averages)',
        xaxis: {
            autorange: true,
            range: ['2000', '2020'],
            rangeselector: {
                buttons: [
                    {
                        count: 1,
                        label: '1Y',
                        step: 'year',
                        stepmode: 'backward'
                    },
                    {
                        count: 5,
                        label: '5Y',
                        step: 'year',
                        stepmode: 'backward'
                    },
                    {
                        count: 10,
                        label: '10Y',
                        step: 'year',
                        stepmode: 'backward'
                    },
                    { step: 'all' }
                ]
            },
            rangeslider: { range: ['2000', '2020'] },
            type: 'date'
        },
        yaxis: {
            autorange: true,
            // range: [86.8700008333, 138.870004167],
            type: 'linear'
        }
    };

    Plotly.newPlot('time1', data, layout);

    // var trace1 = {
    //     x: world_gross, 
    //     y: budget, 
    //     z: movie_count,
    //     name: '',
    //     // colorscale: figure.data[0].colorscale,
    //     type: 'surface',
    //     showscale: false
    // }
    // var data = [trace1];
    // // console.log(data)

    // var layout = {
    //     title: 'Avg. Budget and Total Movies released per Year',
    //     showlegend: false,
    //     autosize: true,
    //     width: 600,
    //     height: 600,
    //     scene: {
    //         xaxis: { title: 'Years' },
    //         yaxis: { title: 'Avg. Budget' },
    //         zaxis: { title: 'Movie Count' }
    //     }
    // };

    // Plotly.newPlot('histogram', data, layout);

    //Table Chart
    var data = [{
        type: 'table',
        header: {
            values: [["<b>Year</b>"], ["<b>Avg. Budget</b>"],
            ["<b>Movies</b>"], ["<b>Total Theatre Releases</b>"]],
            align: "center",
            line: { width: 1, color: '#506784' },
            fill: { color: '#119DFF' },
            font: { family: "Arial", size: 12, color: "white" }
        },
        cells: {
            values: values,
            align: "center",
            line: { color: "#506784", width: 1 },
            fill: { color: ['#25FEFD', 'white'] },
            font: { family: "Arial", size: 11, color: ["#506784"] }
        }
    }]

    Plotly.newPlot('bar', data);

    //Avg. Budget and Avg. World Gross Income per Year
    var trace1 = {
        x: budget.map(d => d[0]),
        y: budget.map(d => d[1]),
        type: 'scatter',
        name: 'Budget'
    };

    var trace2 = {
        x: world_gross.map(d => d[0]),
        y: world_gross.map(d => d[1]),
        type: 'bar',
        name: 'World Gross'
    };

    var data = [trace1, trace2];

    var layout = {
        title: "Avg. Budget and Avg. World Gross Income per Year",
        // automargin: true,
        //barmode: "group",
        xaxis: {
            title: "Years"
        }
    };

    Plotly.newPlot('histogram', data, layout);

};


// Function ot handle the change in drop down selection
function optionChanged(genre) {
    d3.json("/api/v1/resources/movies").then(function(data) {

        data.forEach(function(row) {
            row.budget = row.budget.replace(/\$/g, '').replace(/,/g, '');
            row.domestic_gross = row.domestic_gross.replace(/\$/g, '').replace(/,/g, '');
            row.international_gross = row.international_gross.replace(/\$/g, '').replace(/,/g, '');
            row.theatres = row.theatres.replace(/\$/g, '').replace(/,/g, '');
            row.world_gross = row.world_gross.replace(/\$/g, '').replace(/,/g, '');
            row.budget = +row.budget
            row.domestic_gross = +row.domestic_gross
            row.international_gross = +row.international_gross
            row.theatres = +row.theatres
            row.world_gross = +row.world_gross
        });

        //console.log(data)

        var test = [];
        data.forEach(function each(item) {
            if (Array.isArray(item)) {
                item.forEach(each);
            } else {
                //test.push({["year_released"] : item.year_released , ["genre"] : item.genres});
                for (i = 0; i < item.genres.length; i++) {
                    test.push({
                        ["year_released"]: item.year_released, ["genre"]: item.genres[i], ["budget"]: item.budget,
                        ["domestic_gross"]: item.domestic_gross, ["international_gross"]: item.international_gross,
                        ["world_gross"]: item.world_gross, ["distributor"]: item.distributor,
                        ["running_time"]: item.running_time, ["theatres"]: item.theatres
                    })
                }
            }
        })

        if (genre == 'Select') {
            genre = ''
            indexPlots(genre, data);
        } else {
            indexPlots(genre, test);    
        }

        // if (genre == 'Please select a genre') {
        //     genre = ''

        // };
        // console.log(genre)
        // plotScatterForProfits(genre, test);
    });
};

function init() {

    // Call the flask API to retrieve the JSON data
    d3.json("/api/v1/resources/movies").then(function(data) {
        
        data.forEach(function(row) {
            row.budget = row.budget.replace(/\$/g, '').replace(/,/g, '');
            row.domestic_gross = row.domestic_gross.replace(/\$/g, '').replace(/,/g, '');
            row.international_gross = row.international_gross.replace(/\$/g, '').replace(/,/g, '');
            row.theatres = row.theatres.replace(/\$/g, '').replace(/,/g, '');
            row.world_gross = row.world_gross.replace(/\$/g, '').replace(/,/g, '');
            row.budget = +row.budget
            row.domestic_gross = +row.domestic_gross
            row.international_gross = +row.international_gross
            row.theatres = +row.theatres
            row.world_gross = +row.world_gross
        });

        //console.log(data)        
        var test = [];
        data.forEach(function each(item) {
            if (Array.isArray(item)) {
                item.forEach(each);
            } else {
                //test.push({["year_released"] : item.year_released , ["genre"] : item.genres});
                for (i = 0; i < item.genres.length; i++) {
                    test.push({
                        ["year_released"]: item.year_released, ["genre"]: item.genres[i], ["budget"]: item.budget,
                        ["domestic_gross"]: item.domestic_gross, ["international_gross"]: item.international_gross,
                        ["world_gross"]: item.world_gross, ["distributor"]: item.distributor,
                        ["running_time"]: item.running_time, ["theatres"]: item.theatres
                    })
                }
            }
        })

        var arrgenres = test.map(item => item.genre);

        //console.log(arrgenres)

        var arruniquegenres = arrgenres.filter(function (item, pos) {
            return arrgenres.indexOf(item) == pos;
        }).sort();

        //console.log(arruniquegenres)

        // Add World to Unique countries list
        arruniquegenres.splice(0, 0, 'Select');

        // Add the countries to the drop down

        var options = selObj.selectAll("option")
            .data(arruniquegenres) // Array of individual IDs
            .enter() // Used when the joined array is longer than the selection
            .append("option")
            .attr('value', (v => v))
            .text((t => t));

        // Fetch country for the default plot
        // var country = arrUniqueCountries[0];
        var genre = '';

        // console.log(genre)
        // Call function to build scatter plots
        indexPlots(genre, data);
        // heat_map(json);
    });
};

// Select the dropdown object
var selObj = d3.select('#selDataset');

init();

// // Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/coffee-flavors.csv', function(err, rows){
//     ​
//     //     console.log(rows)
//     ​
//     //     function unpack(rows, key) {
//     //         // console.log(key)
//     //         return rows.map(function (row) {
//     //             return row[key]
//     //         })
//     ​
//     ​
//     //     }
//     ​
//     //     var data = [{
//     //         type: "sunburst",
//     //         maxdepth: 2,
//     //         ids: rows.map(d => d.ids),
//     //         labels: rows.map(d => d.labels),
//     //         parents: rows.map(d => d.parents),
//     //         textposition: 'inside',
//     //         insidetextorientation: 'radial'
//     //     }]
//     ​
//     //     var layout = { margin: { l: 0, r: 0, b: 0, t: 0 } }
//     ​
//     //     Plotly.newPlot('scatter1', data, layout)
//     // })
//     ​
//     ​
//     // Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/coffee-flavors.csv', function (err, rows) {
//     //     console.log(rows)
//     ​
//     //     function unpack(rows, key) {
//     //         return rows.map(function (row) { return row[key]; });
//     //     }
//     ​
//     //     var data = [
//     //         {
//     //             type: "sunburst",
//     //             maxdepth: 3,
//     //             ids: unpack(rows, 'ids'),
//     //             labels: unpack(rows, 'labels'),
//     //             parents: unpack(rows, 'parents')
//     //         }
//     //     ];
//     ​
//     //     var layout = {
//     //         margin: { l: 0, r: 0, b: 0, t: 0 },
//     //         sunburstcolorway: [
//     //             "#636efa", "#EF553B", "#00cc96", "#ab63fa", "#19d3f3",
//     //             "#e763fa", "#FECB52", "#FFA15A", "#FF6692", "#B6E880"
//     //         ],
//     //         extendsunburstcolorway: true
//     //     };
//     ​
//     ​
//     //     Plotly.newPlot('scatter1', data, layout, { showSendToCloud: true });
//     // })
//     ​
//     ​
//     // Return an Array of profit
//     function getData(genre, data) {
//         // console.log(data)
//         // return genre == '' ? data.map(item => item.budget) :
//         return genre == '' ? data :
//             //data.filter(item => item.genre == genre).map(item => item.budget);
//             data.filter(item => item.genre == genre);
//     ​
//     };
//     ​
//     // Index page plots 
//     function indexPlots(genre, data) {
//     ​
//         var ndata = getData(genre, data);
//         // console.log(ndata)
//     ​
//         var budget = d3.rollup(ndata, v => d3.mean(v, d => d.budget), d => d.year_released);
//         budget = Array.from(budget.entries())
//     ​
//         // console.log(budget)
//     ​
//         var domestic_gross = d3.rollup(ndata, v => d3.mean(v, d => d.domestic_gross), d => d.year_released);
//         domestic_gross = Array.from(domestic_gross.entries())
//     ​
//         var international_gross = d3.rollup(ndata, v => d3.mean(v, d => d.international_gross), d => d.year_released);
//         international_gross = Array.from(international_gross.entries())
//     ​
//         var world_gross = d3.rollup(ndata, v => d3.mean(v, d => d.world_gross), d => d.year_released);
//         world_gross = Array.from(world_gross.entries())
//     ​
//         var movie_count = d3.rollup(ndata, v => d3.count(v, d => d.year_released), d => d.year_released);
//         movie_count = Array.from(movie_count.entries())
//     ​
//         var theatres = d3.rollup(ndata, v => d3.sum(v, d => d.theatres), d => d.year_released);
//         theatres = Array.from(theatres.entries())
//         // console.log(theatres)
//     ​
//         var values = []
//         values = [budget.map(d => d[0]), budget.map(d => d[1]), movie_count.map(d => d[1]), theatres.map(d => d[1])]
//     ​
//         //Worls vs Domestic and International Time Series
//         var trace1 = {
//             type: "scatter",
//             mode: "lines",
//             name: 'Avg. World Gross Income',
//             x: world_gross.map(d => d[0]),
//             y: world_gross.map(d => d[1]),
//             line: { color: '#17BECF' }
//         }
//     ​
//         var trace3 = {
//             type: "scatter",
//             mode: "lines",
//             name: 'Avg. Domestic Gross Income',
//             x: world_gross.map(d => d[0]),
//             y: domestic_gross.map(d => d[1]),
//             line: { color: '#9acd32' }
//         }
//     ​
//         var trace2 = {
//             type: "scatter",
//             mode: "lines",
//             name: 'Avg. International Gross Income',
//             x: world_gross.map(d => d[0]),
//             y: international_gross.map(d => d[1]),
//             line: { color: '#98FB98' }
//         }
//     ​
//         var data = [trace1, trace2, trace3];
//     ​
//         var layout = {
//             title: 'World Gross vs Domestic and International Gross Income (Averages)',
//             xaxis: {
//                 autorange: true,
//                 range: ['2000', '2020'],
//                 rangeselector: {
//                     buttons: [
//                         {
//                             count: 1,
//                             label: '1Y',
//                             step: 'year',
//                             stepmode: 'backward'
//                         },
//                         {
//                             count: 5,
//                             label: '5Y',
//                             step: 'year',
//                             stepmode: 'backward'
//                         },
//                         {
//                             count: 10,
//                             label: '10Y',
//                             step: 'year',
//                             stepmode: 'backward'
//                         },
//                         { step: 'all' }
//                     ]
//                 },
//                 rangeslider: { range: ['2000', '2020'] },
//                 type: 'date'
//             },
//             yaxis: {
//                 autorange: true,
//                 // range: [86.8700008333, 138.870004167],
//                 type: 'linear'
//             }
//         };
//     ​
//         Plotly.newPlot('time1', data, layout);
//     ​
//         // var trace1 = {
//         //     x: world_gross, 
//         //     y: budget, 
//         //     z: movie_count,
//         //     name: '',
//         //     // colorscale: figure.data[0].colorscale,
//         //     type: 'surface',
//         //     showscale: false
//         // }
//         // var data = [trace1];
//         // // console.log(data)
//     ​
//         // var layout = {
//         //     title: 'Avg. Budget and Total Movies released per Year',
//         //     showlegend: false,
//         //     autosize: true,
//         //     width: 600,
//         //     height: 600,
//         //     scene: {
//         //         xaxis: { title: 'Years' },
//         //         yaxis: { title: 'Avg. Budget' },
//         //         zaxis: { title: 'Movie Count' }
//         //     }
//         // };
//     ​
//         // Plotly.newPlot('histogram', data, layout);
//     ​
//         //Table Chart
//         var data = [{
//             type: 'table',
//             header: {
//                 values: [["<b>Year</b>"], ["<b>Avg. Budget</b>"],
//                 ["<b>Movies</b>"], ["<b>Total Theatre Releases</b>"]],
//                 align: "center",
//                 line: { width: 1, color: '#506784' },
//                 fill: { color: '#119DFF' },
//                 font: { family: "Arial", size: 12, color: "white" }
//             },
//             cells: {
//                 values: values,
//                 align: "center",
//                 line: { color: "#506784", width: 1 },
//                 fill: { color: ['#25FEFD', 'white'] },
//                 font: { family: "Arial", size: 11, color: ["#506784"] }
//             }
//         }]
//     ​
//         Plotly.newPlot('bar', data);
//     ​
//         //Avg. Budget and Avg. World Gross Income per Year
//         var trace1 = {
//             x: budget.map(d => d[0]),
//             y: budget.map(d => d[1]),
//             type: 'scatter',
//             name: 'Budget'
//         };
//     ​
//         var trace2 = {
//             x: world_gross.map(d => d[0]),
//             y: world_gross.map(d => d[1]),
//             type: 'bar',
//             name: 'World Gross'
//         };
//     ​
//         var data = [trace1, trace2];
//     ​
//         var layout = {
//             title: "Avg. Budget and Avg. World Gross Income per Year",
//             // automargin: true,
//             //barmode: "group",
//             xaxis: {
//                 title: "Years"
//             }
//         };
//     ​
//         Plotly.newPlot('histogram', data, layout);
//     ​
//     };
//     ​
//     ​
//     // Function ot handle the change in drop down selection
//     function optionChanged(genre) {
//         // d3.json("movies.json").then(function (data) {
//     ​
//         data = movies
//     ​
//         data.forEach(function (row) {
//             row.budget = row.budget.replace(/\$/g, '').replace(/,/g, '');
//             row.domestic_gross = row.domestic_gross.replace(/\$/g, '').replace(/,/g, '');
//             row.international_gross = row.international_gross.replace(/\$/g, '').replace(/,/g, '');
//             row.theatres = row.theatres.replace(/\$/g, '').replace(/,/g, '');
//             row.world_gross = row.world_gross.replace(/\$/g, '').replace(/,/g, '');
//             row.budget = +row.budget
//             row.domestic_gross = +row.domestic_gross
//             row.international_gross = +row.international_gross
//             row.theatres = +row.theatres
//             row.world_gross = +row.world_gross
//         });
//     ​
//         //console.log(data)
//     ​
//         var test = [];
//         data.forEach(function each(item) {
//             if (Array.isArray(item)) {
//                 item.forEach(each);
//             } else {
//                 //test.push({["year_released"] : item.year_released , ["genre"] : item.genres});
//                 for (i = 0; i < item.genres.length; i++) {
//                     test.push({
//                         ["year_released"]: item.year_released, ["genre"]: item.genres[i], ["budget"]: item.budget,
//                         ["domestic_gross"]: item.domestic_gross, ["international_gross"]: item.international_gross,
//                         ["world_gross"]: item.world_gross, ["distributor"]: item.distributor,
//                         ["running_time"]: item.running_time, ["theatres"]: item.theatres
//                     })
//                 }
//             }
//         })
//     ​
//         if (genre == 'Select') {
//             genre = ''
//             indexPlots(genre, data);
//         } else {
//             indexPlots(genre, test);
//         }
//     ​
//         // if (genre == 'Please select a genre') {
//         //     genre = ''
//     ​
//         // };
//         // console.log(genre)
//         // plotScatterForProfits(genre, test);
//         // });
//     };
//     ​
//     function init() {
//     ​
//         // Call the flask API to retrieve the JSON data
//         // d3.json("movies.json").then(function(data) {
//         data = movies
//     ​
//         data.forEach(function (row) {
//             row.budget = row.budget.replace(/\$/g, '').replace(/,/g, '');
//             row.domestic_gross = row.domestic_gross.replace(/\$/g, '').replace(/,/g, '');
//             row.international_gross = row.international_gross.replace(/\$/g, '').replace(/,/g, '');
//             row.theatres = row.theatres.replace(/\$/g, '').replace(/,/g, '');
//             row.world_gross = row.world_gross.replace(/\$/g, '').replace(/,/g, '');
//             row.budget = +row.budget
//             row.domestic_gross = +row.domestic_gross
//             row.international_gross = +row.international_gross
//             row.theatres = +row.theatres
//             row.world_gross = +row.world_gross
//         });
//     ​
//         //console.log(data)        
//         var test = [];
//         data.forEach(function each(item) {
//             if (Array.isArray(item)) {
//                 item.forEach(each);
//             } else {
//                 //test.push({["year_released"] : item.year_released , ["genre"] : item.genres});
//                 for (i = 0; i < item.genres.length; i++) {
//                     test.push({
//                         ["year_released"]: item.year_released, ["genre"]: item.genres[i], ["budget"]: item.budget,
//                         ["domestic_gross"]: item.domestic_gross, ["international_gross"]: item.international_gross,
//                         ["world_gross"]: item.world_gross, ["distributor"]: item.distributor,
//                         ["running_time"]: item.running_time, ["theatres"]: item.theatres
//                     })
//                 }
//             }
//         })
//     ​
//         var arrgenres = test.map(item => item.genre);
//     ​
//         //console.log(arrgenres)
//     ​
//         var arruniquegenres = arrgenres.filter(function (item, pos) {
//             return arrgenres.indexOf(item) == pos;
//         }).sort();
//     ​
//         //console.log(arruniquegenres)
//     ​
//         // Add World to Unique countries list
//         arruniquegenres.splice(0, 0, 'Select');
//     ​
//         // Add the countries to the drop down
//     ​
//         var options = selObj.selectAll("option")
//             .data(arruniquegenres) // Array of individual IDs
//             .enter() // Used when the joined array is longer than the selection
//             .append("option")
//             .attr('value', (v => v))
//             .text((t => t));
//     ​
//         // Fetch country for the default plot
//         // var country = arrUniqueCountries[0];
//         var genre = '';
//     ​
//         // console.log(genre)
//         // Call function to build scatter plots
//         indexPlots(genre, data);
//         // heat_map(json);
//         // });
//     };
//     ​
//     // Select the dropdown object
//     var selObj = d3.select('#selDataset');
//     ​
//     init();