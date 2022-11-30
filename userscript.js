// ==UserScript==
// @name         PlanItPoker Linker
// @namespace    http://artemeon.de/
// @version      0.1
// @description  Add GitHub links to Story Titles
// @author       Marc Reichel
// @match        https://www.planitpoker.com/board/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=planitpoker.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const observeDOM = (function (){
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        return function (element, callback) {
            if (!element || element.nodeType !== 1) {
                return;
            }

            if (MutationObserver) {
                const mutationObserver = new MutationObserver(callback);

                mutationObserver.observe(element, { childList: true, subtree: true });

                return mutationObserver;
            } else if (window.addEventListener) {
                element.addEventListener('DOMNodeInserted', callback, false);
                element.addEventListener('DOMNodeRemoved', callback, false);
            }
        }
    })();

    const addLink = function (node, parentNode) {
        let text = node.innerText;

        const issue = text.match(/#([0-9]+)/);
        const href = 'https://github.com/artemeon/core-ng/issues/' + issue[1];

        let linkElement = parentNode.querySelector('[data-github-link]');

        if (!linkElement) {
            linkElement = document.createElement('a');
            linkElement.dataset.githubLink = '';
            linkElement.target = "_blanc";
            linkElement.style.display = "inline-block";
            linkElement.style.padding = "0 10px";
            linkElement.style.fontSize = "20px";
            parentNode.appendChild(linkElement);
        }

        linkElement.href = href;
        linkElement.innerText = issue[0];

        parentNode.querySelector('a[data-github-link]').addEventListener('click', (event) => {
            event.stopPropagation();
        });
    };

    setTimeout(() => {
        const title = document.querySelector('.page-board-vote .story-title');

        if (!title) {
            return;
        }

        title.style.display = "flex";
        title.style.alignItems = "center";

        document.querySelector('.page-board-vote .story-title .story-title-inner').style.flex = "1 1 0%";

        const text = document.querySelector('.page-board-vote .story-title .story-title-inner .story-text');

        addLink(text, title);

        observeDOM(text, function (m) {
            addLink(text, title);
        });
    }, 2000);
})();
