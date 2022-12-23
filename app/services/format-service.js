export default class FormatService {
  static formatSegment(urlSegment) {
    const splits = urlSegment.replace('/', '').split('-');
    const capitalized = splits.map((split) => {
      return split.charAt(0).toUpperCase() + split.slice(1);
    });
    const title = capitalized.slice(0, 2).join(' ');
    const subtitle = capitalized.slice(2).join(' ');
    return {
      title,
      subtitle,
    };
  }

  static formatPapers(unformattedPapers) {
    return new Promise((resolve, reject) => {
      try {
        const formattedPapers = [];
        for (const unformattedPaper of unformattedPapers) {
          let index = parseInt(unformattedPaper.PartNr);
          if (index === 0) {
            index += 1;
          }
          if (formattedPapers[index]) {
            formattedPapers[index].push(unformattedPaper);
          } else {
            formattedPapers[index] = [unformattedPaper];
          }
        }
        // formattedPapers[1].unshift(unformattedPapers[0]);
        // remove first array which is empty from formattedPapers.
        formattedPapers.shift();
        // console.log({ formattedPapers });
        resolve(formattedPapers);
      } catch (error) {
        reject(error);
      }
    });
  }

  static formatSections(unformattedSections) {
    return new Promise((resolve, reject) => {
      try {
        const formattedSections = [];
        for (const unformattedSection of unformattedSections) {
          const index = parseInt(unformattedSection.PaperNr);
          if (formattedSections[index]) {
            formattedSections[index].push(unformattedSection);
          } else {
            formattedSections[index] = [unformattedSection];
          }
        }
        resolve(formattedSections);
      } catch (error) {
        reject(error);
      }
    });
  }

  static formatContents(unformattedContents) {
    return new Promise((resolve, reject) => {
      try {
        const formattedContents = [];
        let prevIndex = 0;
        let chunk = [];
        for (const [
          index,
          unformattedContent,
        ] of unformattedContents.entries()) {
          const paperIndex = parseInt(unformattedContent.PaperPar) + 1;
          if (paperIndex > prevIndex) {
            chunk.push(unformattedContent);
            prevIndex = prevIndex + 1;
            if (index === unformattedContents.length - 1) {
              formattedContents.push(chunk);
            }
          } else {
            formattedContents.push(chunk);
            chunk = [unformattedContent];
            prevIndex = 0;
          }
        }
        resolve(formattedContents);
      } catch (error) {
        reject(error);
      }
    });
  }

  static formatDBResults(length, results) {
    return new Promise((resolve, reject) => {
      try {
        formattedResults = [];
        for (let index = 0; index < length; index++) {
          formattedResults.push(results(index));
        }
        resolve(formattedResults);
      } catch (error) {
        reject(error);
      }
    });
  }
  
}
