const thxlink = "https://some-du6e.github.io/hxxps/thx"




function deobfuscatelink(obfuscatedLink) {
    // replaces hxxp with http and hxxps with https
    // and also replaces [.] with .
    // also does (.) with .
    // also does (dot) with .
    // also does [dot] with .
    // also does [:] with :
    // also does (:) with :
    // also does [/] with /
    // also does (/) with /
  const fixedhttps = obfuscatedLink.replace(/hxxps?/gi, function(match) {
    return match.toLowerCase() === "hxxps" ? "https" : "http";
  })

  const fixedschemes = fixedhttps.replace(/\[:\/\/\]|\(:\/\/\)/g, "://");
  const fixeddots = fixedschemes.replace(/\[\.\]|\(\.\)|\(dot\)|\[dot\]/gi, ".");
  const fixedcolons = fixeddots.replace(/\[:\]|\(:\)/g, ":");
  const fixedslashes = fixedcolons.replace(/\[\/\]|\(\/\)/g, "/");
  const nospaces = fixedslashes.replace(/\s+/g, "");

  return nospaces;
}

function obfuscatelink(link) {
    const fixedhttps = link.replace(/https?/gi, function(match) {
        return match.toLowerCase() === "https" ? "hxxps" : "hxxp";
    });
    const fixeddots = fixedhttps.replace(/\./g, "[.]");
    return fixeddots;
}



function handleContextMenuClick(info, tab) {
  switch (info.menuItemId) {
    case "convert-obfuscated": {
      const obfuscated = obfuscatelink(info.selectionText);
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (text) => {
          const active = document.activeElement;
          const isEditable = active && (
            active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.isContentEditable
          );
          const isInput = active.tagName === "INPUT" || active.tagName === "TEXTAREA";
          if (isInput) {
            active.setRangeText(text, active.selectionStart, active.selectionEnd, "end");
            active.dispatchEvent(new Event("input", { bubbles: true }));
          } else if (isEditable) {
            const sel = window.getSelection();
            if (sel.rangeCount > 0) {
              const range = sel.getRangeAt(0);
              range.deleteContents();
              range.insertNode(document.createTextNode(text));
              range.collapse(false);
              sel.removeAllRanges();
              sel.addRange(range);
              active.dispatchEvent(new Event("input", { bubbles: true }));
            }
          } else {
            navigator.clipboard.writeText(text);
          }
        },
        args: [obfuscated]
      });
      break;
    }
    case "copy-unobfuscated": {
      const deobfuscated = deobfuscatelink(info.selectionText);
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (text) => navigator.clipboard.writeText(text),
        args: [deobfuscated]
      });
      break;
    }
    case "open-in-new-tab":
      chrome.tabs.create({ url: deobfuscatelink(info.selectionText) });
      break;
    case "open-in-incognito-window":
      let linkeroo = deobfuscatelink(info.selectionText)
      chrome.windows.create({ url: linkeroo, incognito: true });
      break;
    default:
      break;
  }
}




// ik it looks ugly but chill
chrome.runtime.onInstalled.addListener(() => {
  // Parent menu item
  chrome.contextMenus.create({
    id: "parent-menu",
    title: "Hxxps",
    type: "normal",
    contexts: ["selection"],
  })
  chrome.contextMenus.create({
    id: "convert-obfuscated",
    title: "Convert to obfuscated link",
    type: "normal",
    parentId: "parent-menu",
    contexts: ["selection"],
  })
  chrome.contextMenus.create({
    id: "copy-unobfuscated",
    title: "Copy unobfuscated link",
    type: "normal",
    parentId: "parent-menu",
    contexts: ["selection"],
  })
  chrome.contextMenus.create({
    id: "open-in-submenu",
    title: "Open deobfuscated in...",
    type: "normal",
    parentId: "parent-menu",
    contexts: ["selection"]
  })
  chrome.contextMenus.create({
    id: "open-in-new-tab",
    title: "a new tab",
    type: "normal",
    parentId: "open-in-submenu",
    contexts: ["selection"]
  })
  chrome.contextMenus.create({
    id: "open-in-incognito-window",
    title: "a incognito window",
    type: "normal",
    parentId: "open-in-submenu",
    contexts: ["selection"]
  })
})

chrome.contextMenus.onClicked.addListener(handleContextMenuClick)
