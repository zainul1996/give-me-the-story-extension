// this code will be executed before page load
var DATA;
var toggle = false;
var hiddenhighlights = false;

(function () {
  console.log('before.js executed');
  retrieveBackings();
})();

let lastHighlightedText = "";

function insertBaseDocument(highlightedword, backings, currentLink) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  if (document.getElementById("GMTS_Form_Truth").value == "true") {
    var raw = JSON.stringify({
      fields: {
        backings: {
          arrayValue: {
            values: [
              {
                mapValue: {
                  fields: {
                    negativeBackings: {
                      arrayValue: {
                        values: [],
                      },
                    },
                    positiveBackings: {
                      arrayValue: {
                        values: [
                          {
                            stringValue: backings,
                          },
                        ],
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        keywords: {
          arrayValue: {
            values: [
              {
                stringValue: highlightedword,
              },
            ],
          },
        },
        site_name: {
          stringValue: currentLink,
        },
      },
    });
  } else {
    var raw = JSON.stringify({
      fields: {
        backings: {
          arrayValue: {
            values: [
              {
                mapValue: {
                  fields: {
                    negativeBackings: {
                      arrayValue: {
                        values: [
                          {
                            stringValue: backings,
                          },
                        ],
                      },
                    },
                    positiveBackings: {
                      arrayValue: {
                        values: [],
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        keywords: {
          arrayValue: {
            values: [
              {
                stringValue: highlightedword,
              },
            ],
          },
        },
        site_name: {
          stringValue: currentLink,
        },
      },
    });
  }

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    "https://firestore.googleapis.com/v1beta1/projects/givemethesource/databases/(default)/documents/Sites",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

function deleteDocument(documentID) {
  var requestOptions = {
    method: "DELETE",
    redirect: "follow",
  };

  fetch("https://firestore.googleapis.com/v1/" + documentID, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

function appendDocument(jsonRaw) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: jsonRaw,
    redirect: "follow",
  };

  console.log("RAWJSON");
  console.log(jsonRaw);

  fetch(
    "https://firestore.googleapis.com/v1beta1/projects/givemethesource/databases/(default)/documents/Sites",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

function checkExisting() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  fetch(
    "https://firestore.googleapis.com/v1/projects/givemethesource/databases/(default)/documents/Sites",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      const obj = JSON.parse(result);
      console.log(document.URL);
      console.log(obj.documents);
      for (x in obj.documents) {
        console.log(obj.documents[x].fields.site_name.stringValue);
        if (obj.documents[x].fields.site_name.stringValue == document.URL) {
          checkStatus = true;
          console.log("exist");
          for (y in obj.documents[x].fields.keywords.arrayValue.values) {
            if (
              obj.documents[x].fields.keywords.arrayValue.values[y]
                .stringValue == lastHighlightedText
            ) {
              if (document.getElementById("GMTS_Form_Truth").value == "true") {
                console.log(
                  obj.documents[x].fields.backings.arrayValue.values[y]
                );
                if (
                  obj.documents[x].fields.backings.arrayValue.values[y].mapValue
                    .fields.positiveBackings.arrayValue.values
                ) {
                  obj.documents[x].fields.backings.arrayValue.values[
                    y
                  ].mapValue.fields.positiveBackings.arrayValue.values.push({
                    stringValue: document.getElementById("GMTS_Form_URL").value,
                  });
                } else {
                  obj.documents[x].fields.backings.arrayValue.values[
                    y
                  ].mapValue.fields.positiveBackings.arrayValue["values"] = [
                      {
                        stringValue:
                          document.getElementById("GMTS_Form_URL").value,
                      },
                    ];
                }
              } else {
                if (
                  obj.documents[x].fields.backings.arrayValue.values[y].mapValue
                    .fields.negativeBackings.arrayValue.values
                ) {
                  obj.documents[x].fields.backings.arrayValue.values[
                    y
                  ].mapValue.fields.negativeBackings.arrayValue.values.push({
                    stringValue: document.getElementById("GMTS_Form_URL").value,
                  });
                } else {
                  obj.documents[x].fields.backings.arrayValue.values[
                    y
                  ].mapValue.fields.negativeBackings.arrayValue["values"] = [
                      {
                        stringValue:
                          document.getElementById("GMTS_Form_URL").value,
                      },
                    ];
                }
              }

              appendDocument(
                JSON.stringify({ fields: obj.documents[x].fields })
              );
              deleteDocument(obj.documents[x].name);
              document.getElementById("GMTS_Form_URL").value = "";
              return;
            }
          }
          obj.documents[x].fields.keywords.arrayValue.values.push({
            stringValue: lastHighlightedText,
          });
          if (document.getElementById("GMTS_Form_Truth").value == "true") {
            obj.documents[x].fields.backings.arrayValue.values.push({
              mapValue: {
                fields: {
                  negativeBackings: {
                    arrayValue: {
                      values: [],
                    },
                  },
                  positiveBackings: {
                    arrayValue: {
                      values: [
                        {
                          stringValue:
                            document.getElementById("GMTS_Form_URL").value,
                        },
                      ],
                    },
                  },
                },
              },
            });
          } else {
            obj.documents[x].fields.backings.arrayValue.values.push({
              mapValue: {
                fields: {
                  negativeBackings: {
                    arrayValue: {
                      values: [
                        {
                          stringValue:
                            document.getElementById("GMTS_Form_URL").value,
                        },
                      ],
                    },
                  },
                  positiveBackings: {
                    arrayValue: {
                      values: [],
                    },
                  },
                },
              },
            });
          }
          console.log(obj.documents[x].fields.keywords.arrayValue.values);
          console.log(obj.documents[x].fields.backings.arrayValue.values);
          appendDocument(JSON.stringify({ fields: obj.documents[x].fields }));
          deleteDocument(obj.documents[x].name);
          document.getElementById("GMTS_Form_URL").value = "";
          return;
        }
      }
      console.log("dont_exist");
      insertBaseDocument(
        lastHighlightedText,
        document.getElementById("GMTS_Form_URL").value,
        document.URL
      );
      document.getElementById("GMTS_Form_URL").value = "";
    })
    .catch((error) => console.log("error", error));
}

function retrieveBackings() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    "https://firestore.googleapis.com/v1/projects/givemethesource/databases/(default)/documents/Sites",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      const obj = JSON.parse(result);
      for (x in obj.documents) {
        if (obj.documents[x].fields.site_name.stringValue == document.URL) {
          DATA = obj.documents[x].fields;
          return;
        }
      }
      DATA = {};
    })
    .then(() => {
      for (var item in DATA["keywords"]["arrayValue"]["values"]) {
        selection = DATA["keywords"]["arrayValue"]["values"][item]["stringValue"]
        $element = $('div>:contains(' + selection + ')')
        console.log($element)
        var replacement = $("<span></span>")
          .attr({ class: "hl" })
          .attr({
            onclick:
              'openModal(document.getElementById("highlightDialog"));',
          })
          .html(selection);
        var replacementHtml = $("<div>")
          .append(replacement.clone())
          .remove()
          .html();
        if (toggle) {
          $($element).html($($element).html().replace(selection, replacementHtml));
        }
      }
    })
    .catch((error) => console.log("error", error));
}

function openModal(modal) {
  console.log("open modal");
  console.log("selected word" + lastHighlightedText)
  document.getElementById("pos_table").innerHTML = "";
  document.getElementById("neg_table").innerHTML = "";
  modal.style.display = "block";

  // load and populate table
  var index = 0;
  for (var i in DATA["keywords"]["arrayValue"]["values"]) {
    if (
      DATA["keywords"]["arrayValue"]["values"][i]["stringValue"] ==
      lastHighlightedText
    ) {
      break;
    }
    index++;
  }

  var backings =
    DATA["backings"]["arrayValue"]["values"][index]["mapValue"]["fields"];

  // iterate positive and add to table
  var posTable = document.getElementById("pos_table");
  for (var i in backings["positiveBackings"]["arrayValue"]["values"]) {
    var string =
      backings["positiveBackings"]["arrayValue"]["values"][i]["stringValue"];
    posTable.innerHTML +=
      `
      <tr>
      <td><a target="_blank" href=` +
      string +
      `>` +
      string +
      `</a></td>
      </tr>
    `;
  }

  var negTable = document.getElementById("neg_table");
  for (var i in backings["negativeBackings"]["arrayValue"]["values"]) {
    console.log(backings["negativeBackings"]["arrayValue"]["values"][i])
    var string = backings["negativeBackings"]["arrayValue"]["values"][i]["stringValue"];
    negTable.innerHTML +=
      `
      <tr>
      <td><a target="_blank" href=` +
      string +
      `>` +
      string +
      `</a></td>
      </tr>
  `;
  }
}

function closeModal(modal) {
  console.log("close modal");
  modal.style.display = "none";

  // empty out table
  document.getElementById("pos_table").innerHTML = "";
  document.getElementById("neg_table").innerHTML = "";
}
