import React, { PureComponent, Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { normalizeUnicode } from "../../services/utils-service";
import styles from "../styles";

import HTML from "react-native-render-html";

import { DARK_GREY, WHITE } from "../color";
import {
  DEFAULT_FONT,
  DEFAULT_FONT_BOLD,
  DEFAULT_FONT_ITALIC,
} from "../constants";
import UText from "../shared/u-text";

class ContentView extends PureComponent {
  transformSmallCaps(content) {
    const replaceSmallCapsRegexStart = new RegExp("<smallcaps>", "gi");
    const replaceSmallCapsRegexEnd = new RegExp("</smallcaps>", "gi");
    content = content
      .replace(replaceSmallCapsRegexStart, "</span><span class='smallCaps'>")
      .replace(replaceSmallCapsRegexEnd, "</span><span>");
    return content;
  }
  render() {
    const {
      fontSize,
      compareContents,
      nightMode,
      content,
      parentIndex,
      searchText,
      index,
      foundParagraph,
    } = this.props;
    let {
      Content: paragraph,
      PaperNr,
      PaperSec,
      PaperPar,
      TextTypeId,
      PagePar,
    } = content;
    // const { searchText } = this.props.route.params;
    let searchTextFound = false;
    console.log("seatext", searchText);

    if (searchText) {
      var words = searchText.split(" ");
      console.log("lenght", words);
      for (var i = 0; i < words.length; i++) {
        console.log("words", words[i]);

        const paragraphNorm = normalizeUnicode(paragraph);

        const textNorm = normalizeUnicode(words[i]);
        const replaceRegex = new RegExp(textNorm, "gi");
        const openTag = '<span class="search-text">';
        const closeTag = "</span>";
        let indexOffset = 0;
        let match = null;

        while ((match = replaceRegex.exec(paragraphNorm)) !== null) {
          const index = match.index + indexOffset;
          const firstPart = paragraph.slice(0, index);

          const lastPart = paragraph.slice(index + textNorm.length);
          console.log("Last Part: ", lastPart);
          const extractedText = paragraph.slice(index, index + textNorm.length);
          paragraph = firstPart + openTag + extractedText + closeTag + lastPart;

          searchTextFound = true;
          indexOffset += openTag.length + closeTag.length;
        }
      }
    }
    let color = nightMode ? WHITE : DARK_GREY;
    let backgroundColor = nightMode ? DARK_GREY : WHITE;
    if (searchTextFound) {
      backgroundColor = "#36393F";
      color = WHITE;
    }
    const htmlTagStyle = {
      p: { ...styles.p, fontSize, color, backgroundColor },
      h5: { ...styles.contentH5, fontSize: fontSize + 1, color },
      h6: { ...styles.contentH6, fontSize: fontSize + 1, color },
      em: { ...styles.em },
    };

    const pClass = [
      "",
      "",
      " style='padding-bottom: 0;'",
      " style='padding-bottom: 1em;'",
      " style='padding-bottom: 1.5em;'",
    ];
    let paratype = null;
    if (TextTypeId < pClass.length - 1) {
      paratype = pClass[TextTypeId];
    }

    const classesStyles = {
      title: { ...styles.title, fontSize: fontSize + 2 },
      compareTitle: { ...styles.title, fontSize: fontSize + 1, marginTop: 2 },
      smallCaps: {
        fontFamily: DEFAULT_FONT,
        fontSize: fontSize - 4,
        textTransform: "uppercase",
      },
      "search-text": { color: "#e74c3c" },
      text: { ...styles.p, fontSize, color },
      "super-container": { fontSize: fontSize - 4 },
      asterisk: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        // backgroundColor: '#0F9',
      },
    };

    let prefix = "&emsp;&emsp;&#8205;";
    if (this.props.referenceNumber && ![5, 6].includes(TextTypeId)) {
      prefix = `<span>${PaperNr}:${PaperSec}.${PaperPar}&emsp;</span>`;
    }

    // COMPARE CONTENTS ARE HERE
    let compareParagraph;

    if (compareContents.length > 0) {
      compareParagraph = compareContents[parentIndex][index]["Content"];
    }

    if ([5, 6].includes(TextTypeId)) {
      compareParagraph = null;
      paragraph = `<div class="asterisk">${paragraph}</div>`;
    }
    paragraph = this.transformSmallCaps(paragraph);
    if (compareParagraph) {
      compareParagraph = this.transformSmallCaps(compareParagraph);
    }

    // console.log(`Nested Item Should Update? Width: ${DEVICE_WIDTH} Height: ${DEVICE_HEIGHT}`);
    // console.log(`Grab Window Dimension ${Dimensions.get('window').width}`);
    return (
      <View
        style={{ paddingHorizontal: 10, backgroundColor }}
        selectable
        key={index}
        onLayout={(event) => {
          if (foundParagraph) {
            this.props.jumpToParagraph(index);
          }
        }}
      >
        {index === 0 ? (
          <View style={{ marginVertical: 10 }} selectable>
            <View>
              {PaperNr !== 0 && PagePar === 1 && PaperSec === 0 && (
                <UText
                  style={{
                    fontSize: fontSize + 2,
                    fontFamily: DEFAULT_FONT_BOLD,
                    textAlign: "center",
                    color: color,
                  }}
                >
                  {this.props.localization.paper} {PaperNr}
                </UText>
              )}
              <HTML
                classesStyles={classesStyles}
                tagsStyles={htmlTagStyle}
                source={{
                  html: `<p class="title" ${paratype}>${paragraph}</p>`,
                }}
                defaultTextProps={{ selectable: true }}
              />
            </View>
            {compareParagraph ? (
              <HTML
                classesStyles={classesStyles}
                tagsStyles={htmlTagStyle}
                source={{
                  html: `<p class="compareTitle" ${paratype}>${compareParagraph}</p>`,
                }}
                defaultTextProps={{ selectable: true }}
              />
            ) : null}
          </View>
        ) : (
          <View style={{ marginBottom: 2 }}>
            <HTML
              classesStyles={classesStyles}
              tagsStyles={htmlTagStyle}
              source={{
                html: `<div class='text' ${paratype}>${prefix}${paragraph}</div>`,
              }}
              defaultTextProps={{ selectable: true }}
              renderers={{
                sup: (htmlAttribs, children, convertedCSSStyles, passProps) => (
                  <View key="main">{children}</View>
                ),
              }}
            />
            {compareParagraph ? (
              <View style={{ marginVertical: 5 }}>
                <HTML
                  tagsStyles={htmlTagStyle}
                  classesStyles={classesStyles}
                  source={{
                    html: `<div class='text' ${paratype}>${prefix}${compareParagraph}</div>`,
                  }}
                  defaultTextProps={{ selectable: true }}
                  renderers={{
                    sup: (
                      htmlAttribs,
                      children,
                      convertedCSSStyles,
                      passProps
                    ) => <View key="main">{children}</View>,
                  }}
                />
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { compareContents } = state.book;
  const { fontSize, nightMode, referenceNumber } = state.setting;
  const { localization } = state;
  return {
    fontSize,
    nightMode,
    compareContents,
    localization,
    referenceNumber,
  };
}

export default connect(mapStateToProps, null)(ContentView);
