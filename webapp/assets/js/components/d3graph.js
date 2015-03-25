(function ($) {

    $.fn.graphModule = function (_data, structureId, currentStr) {
        $(window).on('resize', resize);

        var config = {
            "title": "Path",
            "graph": {
                "linkDistance": 300,
                "charge": -400,
                "height": 800,
                "numColors": 12,
                "labelPadding": {
                    "left": 5,
                    "right": 5,
                    "top": 2,
                    "bottom": 2
                },
                "labelMargin": {
                    "left": 3,
                    "right": 3,
                    "top": 2,
                    "bottom": 2
                },
                "ticksWithoutCollisions": 10
            },
            "types": {
                "compound": {
                    "short": "Compound",
                    "long": "Compound"
                },
                "scaffold": {
                    "short": "Scaffold",
                    "long": "Scaffold"
                }
            },
            "constraints": [
                {
                    "has": {
                        "type": "compound"
                    },
                    "type": "position",
                    "y": 0.2,
                    "weight": 0.8
                },
                {
                    "has": {
                        "type": "query"
                    },
                    "type": "position",
                    "y": 0.5,
                    "weight": 0.5
                },
                {
                    "has": {
                        "group": "Parents"
                    },
                    "type": "position",
                    "x": 0.2,
                    "y": 0.6,
                    "weight": 0.7
                },
                {
                    "has": {
                        "group": "Children"
                    },
                    "type": "position",
                    "x": 0.8,
                    "y": 0.1,
                    "weight": 0.7
                },
                {
                    "has": {
                        "group": "Structure"
                    },
                    "type": "position",
                    "y": 0.7,
                    "weight": 0.7
                }
            ]
        };
        var graph = {},
            selected = {},
            highlighted = null;
        graph.data = _data;
        drawGraph(structureId);
        function drawGraph(structureId) {
            $('#graph').empty();

            graph.margin = {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            };
            if (config.graph == undefined) {
                config = config.responseJSON;
            }
            var display = $('#graph').css('display');
            $('#graph')
                .css('display', 'block')
                .css('height', config.graph.height + 'px');
            graph.width = $('#graph').width() - graph.margin.left - graph.margin.right;
            graph.height = $('#graph').height() - graph.margin.top - graph.margin.bottom;
            $('#graph').css('display', display);

            for (var name in graph.data) {
                var obj = graph.data[name];
                obj.positionConstraints = [];
                obj.linkStrength = 1;

                config.constraints.forEach(function (c) {
                    for (var k in c.has) {
                        if (c.has[k] !== obj[k]) {
                            return true;
                        }
                    }

                    switch (c.type) {
                        case 'position':
                            obj.positionConstraints.push({
                                weight: c.weight,
                                x: c.x * graph.width,
                                y: c.y * graph.height
                            });
                            break;

                        case 'linkStrength':
                            obj.linkStrength *= c.strength;
                            break;
                    }
                });
            }

            graph.links = [];
            for (var name in graph.data) {
                var obj = graph.data[name];
                for (var depIndex in obj.depends) {
                    var link = {
                        comment: obj.comment,
                        source: graph.data[obj.depends[depIndex]],
                        target: obj
                    };

                    link.strength = (link.source.linkStrength || 1) * (link.target.linkStrength || 1);
                    graph.links.push(link);
                }
            }
            graph.categories = {};
            for (var name in graph.data) {
                var obj = graph.data[name],
                    key = obj.type/* + ':' + (obj.group || '')*/,
                    cat = graph.categories[key];
                obj.categoryKey = key;
                if (!cat) {
                    var typeName = obj.type;
                    typeName = (config.types[typeName]) ? config.types[typeName]['short'] : typeName;
                    cat = graph.categories[key] = {
                        key: key,
                        type: obj.type,
                        typeName: typeName,
                        group: obj.group,
                        count: 0
                    };
                }
                cat.count++;
            }
            graph.categoryKeys = d3.keys(graph.categories);
            graph.categoryKeys = ["compound", "scaffold"];

            graph.colors = colorbrewer.Set4[config.graph.numColors];

            function getColorScale(darkness) {
                return d3.scale.ordinal()
                    .domain(graph.categoryKeys)
                    .range(graph.colors.map(function (c) {
                        return d3.hsl(c).darker(darkness).toString();
                    }));
            }

            graph.strokeColor = getColorScale(0.7);
            graph.fillColor = getColorScale(-0.1);

            graph.nodeValues = d3.values(graph.data);

            graph.force = d3.layout.force()
                .nodes(graph.nodeValues)
                .links(graph.links)
                .linkStrength(function (d) {
                    return d.strength;
                })
                .size([graph.width, graph.height])
                .linkDistance(config.graph.linkDistance)
                .charge(config.graph.charge)
                .on('tick', tick);


            graph.svg = d3.select('#graph').append('svg')
                .attr('width', graph.width + graph.margin.left + graph.margin.right)
                .attr('height', graph.height + graph.margin.top + graph.margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + graph.margin.left + ',' + graph.margin.top + ')');

            graph.svg.append('defs').selectAll('marker')
                .data(['end'])
                .enter().append('marker')
                .attr('id', String)
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 10)
                .attr('refY', 0)
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .attr('orient', 'auto')
                .append('path')
                .attr('class', 'link')
                .attr('d', 'M0,-5L10,0L0,5');

            // adapted from http://stackoverflow.com/questions/9630008
            // and http://stackoverflow.com/questions/17883655

            var glow = graph.svg.append('filter')
                .attr('x', '-50%')
                .attr('y', '-50%')
                .attr('width', '200%')
                .attr('height', '200%')
                .attr('id', 'blue-glow');

            glow.append('feColorMatrix')
                .attr('type', 'matrix')
                .attr('values', '0 0 0 0  0 '
                    + '0 0 0 0  0 '
                    + '0 0 0 0  .7 '
                    + '0 0 0 1  0 ');

            glow.append('feGaussianBlur')
                .attr('stdDeviation', 3)
                .attr('result', 'coloredBlur');

            glow.append('feMerge').selectAll('feMergeNode')
                .data(['coloredBlur', 'SourceGraphic'])
                .enter().append('feMergeNode')
                .attr('in', String);
            var a = graph.categoryKeys;

            function oc(a) {
                var o = {};
                for (var i = 0; i < a.length; i++) {
                    o[a[i]] = '';
                }
                return o;
            }

            graph.legend = graph.svg.append('g')
                .attr('class', 'legend')
                .attr('x', 0)
                .attr('y', 0)
                .selectAll('.category')
                .data(d3.values(graph.categories))
                .enter().append('g')
                .attr('class', 'category');

            graph.legendConfig = {
                rectWidth: 12,
                rectHeight: 12,
                xOffset: -10,
                yOffset: 0,
                xOffsetText: 20,
                yOffsetText: 10,
                lineHeight: 15
            };
            graph.legendConfig.xOffsetText += graph.legendConfig.xOffset;
            graph.legendConfig.yOffsetText += graph.legendConfig.yOffset;

            graph.legend.append('rect')
                .attr('x', graph.legendConfig.xOffset)
                .attr('y', function (d, i) {
                    return graph.legendConfig.yOffset + i * graph.legendConfig.lineHeight;
                })
                .attr('height', graph.legendConfig.rectHeight)
                .attr('width', graph.legendConfig.rectWidth)
                .attr('fill', function (d) {
                    return graph.fillColor(d.type);
                })
                .attr('stroke', function (d) {
                    return graph.strokeColor(d.type);
                });

            graph.legend.append('text')
                .attr('x', graph.legendConfig.xOffsetText)
                .attr('y', function (d, i) {
                    return graph.legendConfig.yOffsetText + i * graph.legendConfig.lineHeight;
                })
                .text(function (d) {
                    return d.typeName;
                });

            $('#graph-container').on('scroll', function () {
                graph.legend.attr('transform', 'translate(0,' + $(this).scrollTop() + ')');
            });

            graph.line = graph.svg.append('g').selectAll('.link')
                .data(graph.force.links())
                .enter().append('line')
                .attr('class', 'link')
                .attr("id", function (d, i) {
                    return "linkId_" + i;
                });

            //cpoint


            graph.draggedThreshold = d3.scale.linear()
                .domain([0, 0.1])
                .range([5, 20])
                .clamp(true);

            function dragged(d) {
                var threshold = graph.draggedThreshold(graph.force.alpha()),
                    dx = d.oldX - d.px,
                    dy = d.oldY - d.py;
                if (Math.abs(dx) >= threshold || Math.abs(dy) >= threshold) {
                    d.dragged = true;
                }
                return d.dragged;
            }

            graph.drag = d3.behavior.drag()
                .origin(function (d) {
                    return d;
                })
                .on('dragstart', function (d) {
                    d.oldX = d.x;
                    d.oldY = d.y;
                    d.dragged = false;
                    d.fixed |= 2;
                })
                .on('drag', function (d) {
                    /*if (d3.event.x > 10 && d3.event.x < graph.width-20 && d3.event.y > 70 && d3.event.y < graph.height-10) {
                        d.px = d3.event.x;
                        d.py = d3.event.y;
                    }*/
                    if (d3.event.x > 10 && d3.event.x < graph.width-50) {
                        d.px = d3.event.x;
                    }
                    if (d3.event.y > 70 && d3.event.y < graph.height-10) {
                        d.py = d3.event.y;
                    }

                    if (dragged(d)) {
                        if (!graph.force.alpha()) {
                            graph.force.alpha(.025);
                        }
                    }
                })
                .on('dragend', function (d) {
                    if (!dragged(d)) {
                     //   selectObject(d, this);
                    }
                    // d.fixed &= ~6;
                });

            $('#graph-container').on('click', function (e) {
                if (!$(e.target).closest('.node').length) {
                   // deselectObject();
                }
            });
            graph.node = graph.svg.selectAll('.node')
                .data(graph.force.nodes())
                .enter().append('g')
                .attr('class', 'node')
                .call(graph.drag)
                .on('mouseover', function (d) {
                    if (!selected.obj) {
                        if (graph.mouseoutTimeout) {
                            clearTimeout(graph.mouseoutTimeout);
                            graph.mouseoutTimeout = null;
                        }
                        //highlightObject(d);
                    }
                })
                .on('mouseout', function () {
                    if (!selected.obj) {
                        if (graph.mouseoutTimeout) {
                            clearTimeout(graph.mouseoutTimeout);
                            graph.mouseoutTimeout = null;
                        }
                        graph.mouseoutTimeout = setTimeout(function () {
                            highlightObject(null);
                        }, 100);
                    }
                });

            graph.nodeRect = graph.node.append('rect')
                .attr('rx', 1)
                .attr('ry', 1)
                .attr('stroke', function (d) {
                    return graph.strokeColor(d.type);
                })
                /*.attr('active', function (d) {
                    return graph.strokeColor(d.type);
                })*/
                .attr('fill', function (d) {
                    return graph.fillColor(d.type);
                })
                .attr('width', 120)
                .attr('height', 30)
                .attr("class", "rect");
            graph.linktext = graph.svg.selectAll("g.linklabelholder")
                .data(graph.force.links());
            graph.linktext.enter()
                .append("g").attr("class", "linklabelholder");

            graph.linktext.each(function (l) {
                var comms = [];

                var node = d3.select(this);
                _.each(l.source.toChildcomment, function(commentsArray){
                    if(commentsArray.childID == l.target.id){
                        comms = (commentsArray.comment)
                    }
                });

                _.each(comms, function(comment, index){
                    node.append("rect")
                        .attr("class", "labelBorder"+index);

                    node.append('text')
                        .text(comms ? comment : "")
                        .attr("class", "linklabel")
                        .attr("dx", 1)
                        .attr("dy", index*25)
                        .attr("text-anchor", "middle")
                        .attr("fill", "#000000");

                    if (node[0][0].getBBox().width != 0) {
                        node.select(".labelBorder"+index)
                            .attr('width', node[0][0].lastChild.getBBox().width + 10 + 'px')
                            .attr('height', node[0][0].lastChild.getBBox().height + 6 + 'px')
                            .attr("fill", "#F2F2F2")
                            .attr("stroke", "#cecece")
                            .attr("dx", 1)
                            .attr("rx", 2)
                            .attr("ry", 2)
                            .attr("x", node[0][0].lastChild.getBBox().x - 4)
                            .attr("y", node[0][0].lastChild.getBBox().y - 2)
                            .attr("dy", index*25);
                    }
                })
            });

            graph.node.each(function (d) {
                var node = d3.select(this),
                    rect = node.select('rect'),
                    lines = wrap(d.name),
                    ddy = 1.1 - 0.3,
                    dddy = 1.1,
                    dy = -ddy * lines.length / 2 + .5;

                lines.forEach(function (line) {
                    var text = node.append('text')
                        .text(line.toUpperCase())
                        .attr('dy', dy + 'em');
                    dy += dddy;

                });
                lines.forEach(function (line) {
                    var rec = node.append('rect')
                        .attr('style', 'fill:#ffffff;')
                        .attr('width', '99px')
                        .attr('height', '78px')
                        .attr('rx', '1')
                        .attr('ry', '1')
                        .attr('x', '-3.6em')
                        .attr('y', '-3.5em')
                        .attr('class', 'whiteRect')
                });
                lines.forEach(function () {
                    var defaults = {
                        imgWidth: 100,
                        imgHeight: 80
                    };
                    var id = structureId + defaults.imgWidth + defaults.imgHeight;
                    var molfile = d.structure;

                    var img = node.append('image')
                        .attr('x', '-1.9em')
                        .attr('y', '-6em')
                        .attr('width', defaults.imgWidth + 'px')
                        .attr('class', 'innn')
                        .attr('height', defaults.imgHeight + 'px')
                        .attr('style', 'stroke: #000000; fill:#00ff00;')
                        .attr('xlink:href', d.structureImage);

                });

            });

            setTimeout(function () {
                graph.node.each(function (d) {
                    var node = d3.select(this),
                        text = node.selectAll('text'),
                        bounds = {},
                        first = true;

                    text.each(function () {
                        var box = this.getBBox();
                        if (first || box.x < bounds.x1) {
                            bounds.x1 = box.x;
                        }
                        if (first || box.y < bounds.y1) {
                            bounds.y1 = box.y;
                        }
                        if (first || box.x + box.width > bounds.x2) {
                            bounds.x2 = box.x + box.width;
                        }
                        if (first || box.y + box.height > bounds.y2) {
                            bounds.y2 = box.y + box.height;
                        }
                        first = false;
                    }).attr('text-anchor', 'middle').attr('y', "-8em");

                    var padding = config.graph.labelPadding,
                        margin = config.graph.labelMargin,
                        oldWidth = bounds.x2 - bounds.x1;

                    bounds.x1 -= oldWidth / 2;
                    bounds.x2 -= oldWidth / 2;

                    bounds.x1 -= padding.left + 5;
                    bounds.y1 -= padding.top + 80;
                    bounds.x2 += padding.left + padding.right;
                    bounds.y2 += padding.top + padding.bottom;

                    var diff = bounds.x2 - bounds.x1;
                    if (diff < 100) {
                        bounds.x2 = bounds.x1 + 100;
                        diff = 100
                    }

                    node.selectAll('.whiteRect')
                        .attr('x', bounds.x1)
                        .attr('y', bounds.y1 + 19)
                        .attr('width', diff)

                    node.select('.rect')
                        .attr('x', bounds.x1)
                        .attr('y', bounds.y1)
                        .attr('width', diff)
                        .attr('height', bounds.y2 - bounds.y1);

                    node.selectAll('image')
                        .attr('x', bounds.x1)
                        .attr('y', bounds.y1 + 20)
                        .attr('width', diff)

                    d.extent = {
                        left: bounds.x1 - margin.left,
                        right: bounds.x2 + margin.left + margin.right,
                        top: bounds.y1 - margin.top,
                        bottom: bounds.y2 + margin.top + margin.bottom
                    };

                    d.edge = {
                        left: new geo.LineSegment(bounds.x1, bounds.y1, bounds.x1, bounds.y2),
                        right: new geo.LineSegment(bounds.x2, bounds.y1, bounds.x2, bounds.y2),
                        top: new geo.LineSegment(bounds.x1, bounds.y1, bounds.x2, bounds.y1),
                        bottom: new geo.LineSegment(bounds.x1, bounds.y2, bounds.x2, bounds.y2)
                    };
                });

                graph.numTicks = 0;
                graph.preventCollisions = false;
                graph.force.start();
                for (var i = 0; i < config.graph.ticksWithoutCollisions; i++) {
                    graph.force.tick();
                }
                graph.preventCollisions = true;
                $('#graph-container').css('visibility', 'visible');

            });
        }


        function wrap(text) {
            text = text.toString()
            var maxLineChars = 12,
                wrapChars = ' /_-.'.split('');

            if (text.length <= maxLineChars) {
                return [text];
            } else {
                for (var k = 0; k < wrapChars.length; k++) {
                    var c = wrapChars[k];
                    for (var i = maxLineChars; i >= 0; i--) {
                        /* if (text.charAt(i) === c) {
                         var line = text.substring(0, i + 1);
                         return [line].concat(wrap(text.substring(i + 1)));
                         }*/
                    }
                }
                return [text.substring(0, maxLineChars-3)+'...']
            }
        }

        function preventCollisions() {
            var quadtree = d3.geom.quadtree(graph.nodeValues);

            for (var name in graph.data) {
                var obj = graph.data[name],
                    ox1 = obj.x + obj.extent.left,
                    ox2 = obj.x + obj.extent.right,
                    oy1 = obj.y + obj.extent.top,
                    oy2 = obj.y + obj.extent.bottom;
                quadtree.visit(function (quad, x1, y1, x2, y2) {
                    if (quad.point && quad.point !== obj) {
                        // Check if the rectangles intersect
                        var p = quad.point,
                            px1 = p.x + p.extent.left,
                            px2 = p.x + p.extent.right,
                            py1 = p.y + p.extent.top,
                            py2 = p.y + p.extent.bottom,
                            ix = (px1 <= ox2 && ox1 <= px2 && py1 <= oy2 && oy1 <= py2);
                        if (ix) {
                            var xa1 = ox2 - px1, // shift obj left , p right
                                xa2 = px2 - ox1, // shift obj right, p left
                                ya1 = oy2 - py1, // shift obj up   , p down
                                ya2 = py2 - oy1, // shift obj down , p up
                                adj = Math.min(xa1, xa2, ya1, ya2);

                            if (adj == xa1) {
                                obj.x -= adj / 2;
                                p.x += adj / 2;
                            } else if (adj == xa2) {
                                obj.x += adj / 2;
                                p.x -= adj / 2;
                            } else if (adj == ya1) {
                                obj.y -= adj / 2;
                                p.y += adj / 2;
                            } else if (adj == ya2) {
                                obj.y += adj / 2;
                                p.y -= adj / 2;
                            }
                        }
                        return ix;
                    }
                });
            }
        }

        function tick(e) {
            graph.numTicks++;

            for (var name in graph.data) {
                var obj = graph.data[name];

                obj.positionConstraints.forEach(function (c) {
                    var w = c.weight * e.alpha;
                    if (!isNaN(c.x)) {
                        obj.x = (c.x * w + obj.x * (1 - w));
                    }
                    if (!isNaN(c.y)) {
                        obj.y = (c.y * w + obj.y * (1 - w));
                    }
                });
            }

            if (graph.preventCollisions) {
                preventCollisions();
            }

            graph.line
                .attr('x1', function (d) {
                    return d.source.x + 35;
                })
                .attr('y1', function (d) {
                    return d.source.y;
                })
                .each(function (d) {
                    var x = d.target.x,
                        y = d.target.y,
                        line = new geo.LineSegment(d.source.x, d.source.y, x, y);

                    for (var e in d.target.edge) {
                        var ix = line.intersect(d.target.edge[e].offset(x, y));
                        if (ix.in1 && ix.in2) {
                            x = ix.x;
                            y = ix.y;
                            break;
                        }
                    }

                    d3.select(this)
                        .attr('x2', x)
                        .attr('y2', y);
                });

            //cpoint

            // link label
            graph.linktext.attr("transform", function (d) {
                return "translate(" + (d.source.x + d.target.x) / 2 + ","
                    + (d.source.y + d.target.y) / 2 + ")";
            });
            // nodes
            graph.node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        }

        function selectObject(obj, el) {
            var node;
            if (el) {
                node = d3.select(el);
            } else {
                graph.node.each(function (d) {
                    if (d === obj) {
                        node = d3.select(el = this);
                    }
                });
            }
            if (!node) return;

            if (node.classed('selected')) {
                deselectObject();
                return;
            }
            deselectObject(false);

            selected = {
                obj: obj,
                el: el
            };

//                        highlightObject(obj);

            node.classed('selected', true);
            //$('#docs').html(obj.docs);
            //$('#docs-container').scrollTop(0);
            resize(true);

            /*var $graph = $('#graph-container'),
                nodeRect = {
                    left: obj.x + obj.extent.left + graph.margin.left,
                    top: obj.y + obj.extent.top + graph.margin.top,
                    width: obj.extent.right - obj.extent.left,
                    height: obj.extent.bottom - obj.extent.top
                },
                graphRect = {
                    left: $graph.scrollLeft(),
                    top: $graph.scrollTop(),
                    width: $graph.width(),
                    height: $graph.height()
                };
            if (nodeRect.left < graphRect.left ||
                nodeRect.top < graphRect.top ||
                nodeRect.left + nodeRect.width > graphRect.left + graphRect.width ||
                nodeRect.top + nodeRect.height > graphRect.top + graphRect.height) {

                $graph.animate({
                    scrollLeft: nodeRect.left + nodeRect.width / 2 - graphRect.width / 2,
                    scrollTop: nodeRect.top + nodeRect.height / 2 - graphRect.height / 2
                }, 500);
            }*/
        }

        graph.node.each(function (d) {
            var node = d3.select(this);
            if(d.active) {
                selectObject(d, node[0][0])
            }
        })

        function deselectObject(doResize) {
            if (doResize || typeof doResize == 'undefined') {
                resize(false);
            }
            graph.node.classed('selected', false);
            selected = {};
            highlightObject(null);
        }

        function highlightObject(obj) {
            if (obj) {
                if (obj !== highlighted) {
                    graph.node.classed('inactive', function (d) {
                        return (obj !== d
                            && d.depends.indexOf(obj.structureId) == -1
                            && d.dependedOnBy.indexOf(obj.structureId) == -1);
                    });
                    graph.line.classed('inactive', function (d) {
                        return (obj !== d.source && obj !== d.target);
                    });
                }
                highlighted = obj;
            } else {
                if (highlighted) {
                    graph.node.classed('inactive', false);
                    graph.line.classed('inactive', false);
                }
                highlighted = null;
            }
        }

        var showingDocs = false,
            docsClosePadding = 8,
            desiredDocsHeight = 300;

        function resize(showDocs) {
            var docsHeight = 0,
                graphHeight = 0,
                $docs = $('#docs-container'),
                $graph = $('#graph-container'),
                $close = $('#docs-close');

            if (typeof showDocs == 'boolean') {
                showingDocs = showDocs;
                //  $docs[showDocs ? 'show' : 'hide']();
            }

            if (showingDocs) {
                docsHeight = desiredDocsHeight;
                //$docs.css('height', docsHeight + 'px');
            }

            graphHeight = window.innerHeight - docsHeight;
            //$graph.css('height', graphHeight + 'px');


        }
        return this;
    };

}(jQuery));