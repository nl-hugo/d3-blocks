
/**
 * bl.ocks.js
 * Fetches gists from gist.github.com, similar to bl.ocks.org.
 *
 *
 * @author: Hugo Janssen
 * @date:   9/12/2015
 */
"use strict";

function blocks(user, max) {

  var formatDate = d3.time.format("%B %-d, %Y"),
      parseDate = d3.time.format.iso.parse,
      api = "https://api.github.com/users",
      content = "https://gist.githubusercontent.com",
      blocks = "http://bl.ocks.org",
      gist = "gists",
      fetching = false;

  function fetch() {
    if(!fetching) {
      fetching = true;
      d3.json(api + "/" + encodeURIComponent(user) + "/" + gist, display);
    }
  }

  function display(error, gists) {
    if (error) throw error;
    fetching = false;

    if (!gists.length) {
      d3.select(".loading").remove();
      return;
    }

    if (gists.length > max) {
      gists = gists.slice(0, max);
    }

    gists.forEach(function(d) {
      d.created_at = parseDate(d.created_at);
      d.updated_at = parseDate(d.updated_at);
    });

    var gistEnter = d3.select(".gists").selectAll(".gist")
        .data(gists, function(d) { return d.id; })
      .enter().insert("a", "br")
        .attr("class", "gist")
        .attr("href", function(d) { return blocks + "/" + encodeURIComponent(user) + "/" + d.id; })
        .attr("target", "_blank")
        .style("background-image", function(d) { return "url(" + content + "/" + encodeURIComponent(user) + "/" + d.id + "/raw/thumbnail.png)"; });

    gistEnter.append("span")
        .attr("class", "description")
        .text(function(d) { return d.description || d.id; });

    gistEnter.append("span")
        .attr("class", "date")
        .text(function(d) { return formatDate(d.created_at); });

    d3.select(".gists").selectAll(".gist")
        .sort(function(a, b) { return b.created_at - a.created_at; });

    d3.select("#gist-link").attr("href", blocks + "/" + encodeURIComponent(user));

    d3.select(".loading").remove();
  }

  fetch();
}