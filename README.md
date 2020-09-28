# ZenTube

---

I wanted to be able to take notes on a Youtube video without having to tab out of the window to a text editor all of the time. After seeing Josh Alvanier's [Down](https://down.avanier.now.sh) and Hundred Rabbit's [Left](https://github.com/hundredrabbits/left), I realized I didn't need to do anything fancy, and in fact I preferred the minimalist layout that vanilla JS can provide.

This saves the text you write for a given Youtube video into local storage and will load it up again upon returning to the same video. Supports exporting to a text file with <kbd>ctrl</kbd> + <kbd>s</kbd> and adding automatic timestamps with <kbd>ctrl</kbd> + <kbd>d</kbd>.

Borrowed/stole heavily from [Skeleton CSS](http://getskeleton.com/) and Josh Alvanier's [Down](https://down.avanier.now.sh) for code, stylesheets, and ideas.

---

### TODO:

- ~~ctrl-s for save~~
- ~~ctrl-o to open a new page for another video~~
- ~~add current timestamps to text box~~
- Make text area dynamically fit size of window when under 1000px in width
- Balance video vertically in the window when over 1000px in width
  - The problem is that on a big screen, the video can get really small. On _my_ screen, 1000px is a good breakpoint, but not on a big desktop or a smaller screen. Maybe a better solution is to add a way to switch from horizontal to vertical layout? Move all CSS rules to JS attributes.
