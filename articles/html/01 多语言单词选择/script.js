document.addEventListener("mouseup", function (e) {
    const sel = window.getSelection();
    if (sel.isCollapsed) return;

    const range = sel.getRangeAt(0).cloneRange();
    if (!range) return;

    // 智能边界调整
    adjustBoundarySmart(range, "start");
    adjustBoundarySmart(range, "end");

    sel.removeAllRanges();
    sel.addRange(range);
  });

  // 智能边界调整函数
  function adjustBoundarySmart(range, boundaryType) {
    const isStart = boundaryType === "start";
    const [node, origOffset] = isStart
      ? [range.startContainer, range.startOffset]
      : [range.endContainer, range.endOffset];

    if (node.nodeType !== Node.TEXT_NODE) return;

    const text = node.textContent;
    let newOffset = origOffset;

    // 多语言处理策略
    if (isStart) {
      while (
        newOffset > 0 &&
        isWordPart(text[newOffset - 1], text[newOffset])
      ) {
        newOffset--;
      }
    } else {
      while (
        newOffset < text.length &&
        isWordPart(text[newOffset], text[newOffset - 1])
      ) {
        newOffset++;
      }
    }

    isStart
      ? range.setStart(node, newOffset)
      : range.setEnd(node, newOffset);
  }

  // 增强型字符检测
  function isWordPart(currentChar, prevChar) {
    // Unicode 属性检测（支持多语言）
    const isWordChar =
      /\p{Letter}/u.test(currentChar) || // 任何语言的字母
      /\p{Number}/u.test(currentChar) || // 数字字符
      /[\p{Connector_Punctuation}_-]/u.test(currentChar); // 连接符

    // 中文/日文特殊处理（无空格分隔）
    const isCJK = (c) =>
      /\p{Script=Hani}/u.test(c) ||
      /\p{Script=Katakana}/u.test(c) ||
      /\p{Script=Hiragana}/u.test(c) ||
      /\p{Script=Hangul}/u.test(c);

    // 处理 CJK 字符边界
    if (isCJK(currentChar)) {
      // CJK 字符视为独立单元，除非后面跟着连接符
      return (
        isCJK(prevChar) &&
        (/[\-—・]/.test(prevChar) ||
          /\p{Connector_Punctuation}/u.test(prevChar))
      );
    }

    // 处理西文字符
    return isWordChar;
  }