// ==UserScript==
// @name         PlanItPoker Linker
// @namespace    http://artemeon.de/
// @version      0.2
// @description  Automatically link the issue numbers back to your issue tracking system.
// @author       Marc Reichel
// @match        https://www.planitpoker.com/board/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=planitpoker.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * ------------------------------------------------------------------------
     *  URL Config
     * ------------------------------------------------------------------------
     *
     * Please provide an URL template to your issue tracking
     * system of choice. Use the {id} placeholder for the
     * issue ID. It will be replaced automatically.
     *
     * Example: https://github.com/artemeon/planitpoker-linker/issues/{id}
     *
     */
    const urlTemplate = '';

    /**
     * ------------------------------------------------------------------------
     *  Prefix Config
     * ------------------------------------------------------------------------
     *
     * Please provide a prefix for the issue number.
     * Like '#' for GitHub or 'XYZ-' for Jira.
     *
     */
    const issuePrefix = '#';
    
    /**
     * ========================================================================
     * END OF CONFIG! DO NOT EDIT ANYTHING BELOW!
     * ========================================================================
     */

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

        const regex = new RegExp(`${issuePrefix}([0-9]+)`);
        const issue = text.match(regex);
        const href = urlTemplate.replace('{id}', issue[1]);

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
