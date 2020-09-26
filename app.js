// localstorage controller
const StorageCtrl = (function () {
  return {
    setLS: function (id, value) {
      localStorage.setItem(id, value);
    },
    getLS: function (id) {
      return localStorage.getItem(id);
    },
  };
})();

// ui controller
const UICtrl = (function () {
  const UISelectors = {
    topMatter: '.top-matter',
    legend: '.legend',
    filename: '#filename',
    videoUrl: '#video-url',
    video: '.video-player',
    editorSide: '#editor-side',
    editorBottom: '#editor-bottom',
  };

  return {
    // getters and setters
    getUISelectors: () => UISelectors,
    getBottomText: () => document.querySelector(UISelectors.editorBottom).value,
    getSideText: () => document.querySelector(UISelectors.editorSide).value,
    setBottomText: (text) =>
      (document.querySelector(UISelectors.editorBottom).value = text),
    setSideText: (text) =>
      (document.querySelector(UISelectors.editorSide).value = text),
    // textarea helpers
    addCurrentTime: (time) => {
      const text =
        UICtrl.getBottomText().trim() !== '' ? `\n${time} ` : `${time} `;
      const editorBottom = document.querySelector(UISelectors.editorBottom);
      const editorSide = document.querySelector(UISelectors.editorSide);
      editorBottom.value = `${editorBottom.value}${text}`;
      editorSide.value = `${editorSide.value}${text}`;
    },
    // top matter states
    videoInputState: () => {
      const form = document.createElement('form');

      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('id', 'video-url');
      input.setAttribute('placeholder', 'Youtube URL');

      const button = document.createElement('button');
      button.setAttribute('id', 'video-url-submit');
      button.textContent = 'Submit';

      form.appendChild(input);
      form.appendChild(button);

      const topMatter = document.querySelector(UISelectors.topMatter);
      topMatter.innerHTML = '';
      topMatter.appendChild(form);
    },
    saveFileState: () => {
      const form = document.createElement('form');

      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('id', 'filename');
      input.setAttribute('placeholder', 'Filename.txt');
      input.style.marginRight = '1em';

      const button = document.createElement('button');
      button.setAttribute('id', 'filename-submit');
      button.textContent = 'Submit';

      form.appendChild(input);
      form.appendChild(button);

      const topMatter = document.querySelector(UISelectors.topMatter);
      topMatter.innerHTML = '';
      topMatter.appendChild(form);
    },
    legendState: () => {
      const html = `
        <em class="legend"><span class="line" id="legend-s">ctrl + s: save</span>&nbsp;&nbsp;&nbsp;
          <span class="line" id="legend-time">ctrl + d: add timestamp</span>&nbsp;&nbsp;&nbsp;
          <span class="line" id="legend-o">ctrl + o: open youtube video</span>
        </em>
      `;
      document.querySelector(UISelectors.topMatter).innerHTML = html;
    },
  };
})();

// app
const App = (function (StorageCtrl, UICtrl) {
  const UISelectors = UICtrl.getUISelectors();
  const videoId = location.hash.slice(1)
    ? location.hash.slice(1)
    : 'tI_b9dfJq7A';

  const loadEventListeners = function () {
    document.addEventListener('keyup', parseInput);
    document.addEventListener('DOMContentLoaded', loadNotes);
    document
      .querySelector(UISelectors.topMatter)
      .addEventListener('click', clickTopMatter);
  };

  const parseInput = function (e) {
    if (e.ctrlKey === true && e.code === 'KeyS') {
      UICtrl.saveFileState();
    } else if (e.ctrlKey === true && e.code === 'KeyO') {
      UICtrl.videoInputState();
    } else if (e.ctrlKey === true && e.code === 'KeyD') {
      const time = getCurrentTime();
      UICtrl.addCurrentTime(time);
      saveNotes();
      loadNotes();
    } else {
      // save to ls and refresh both text boxes
      saveNotes(e.srcElement.id);
      loadNotes();
    }
  };

  const clickTopMatter = (e) => {
    if (e.target.id === 'legend-o') {
      UICtrl.videoInputState();
    } else if (e.target.id === 'legend-s') {
      UICtrl.saveFileState();
    } else if (e.target.id === 'legend-time') {
      const time = getCurrentTime();
      UICtrl.addCurrentTime(time);
      saveNotes();
      loadNotes();
    } else if (e.target.id === 'video-url-submit') {
      submitVideo(e);
    } else if (e.target.id === 'filename-submit') {
      exportFile(e);
    }
  };

  const saveNotes = (source) => {
    let text;
    if (source === UISelectors.editorBottom.slice(1)) {
      text = UICtrl.getBottomText();
    } else {
      text = UICtrl.getSideText();
    }
    StorageCtrl.setLS(videoId, text);
  };

  const loadNotes = () => {
    const text = StorageCtrl.getLS(videoId);
    UICtrl.setSideText(text);
    UICtrl.setBottomText(text);
  };

  const exportFile = () => {
    // taken almost exactly from Josh Avanier's "Down" https://down.avanier.now.sh/#030303-e4e4e4
    const filename = document.querySelector(UISelectors.filename).value;
    if (filename !== null || filename !== '') {
      const text = UICtrl.getBottomText().replace(/\n/g, '\r\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const link = Object.assign(document.createElement('a'), {
        download: filename,
        href: window.URL.createObjectURL(blob),
        target: 'target',
      });

      link.click();
    }

    UICtrl.legendState();
    e.preventDefault();
  };

  const submitVideo = (e) => {
    const link = document.querySelector(UISelectors.videoUrl).value;
    const re = /(?<=\?v=)\w{8,}/;
    const videoId = re.exec(link)[0];
    if (videoId === null || videoId === '') {
      UICtrl.legendState();
    }
    const href = `${window.location.origin}${window.location.pathname}#${videoId}`;
    window.location.href = href;
    window.location.reload();

    e.preventDefault();
  };

  getCurrentTime = () => {
    const currentTime = player.getCurrentTime();
    const hours = Math.floor(currentTime / 3600);
    const minutes = Math.floor(currentTime / 60).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    const seconds = Math.floor(currentTime % 60).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    return `[${hours}:${minutes}:${seconds}]`;
  };

  return {
    init: () => {
      loadEventListeners();
      UICtrl.legendState();
    },
  };
})(StorageCtrl, UICtrl);

App.init();
