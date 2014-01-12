var patchMarked = function (marked) {
    var renderer = new marked.Renderer();

    // Add `todo list` support to listitem
    // e.g.:
    //  
    //  - [??] fix this link
    //  - [??] read some books
    //
    // should be rendered into:
    //
    //  <ul>
    //      <li class="todo-item"><input type="checkbox" />fix this link</li>
    //      <li class="todo-item"><input type="checkbox" />read some books</li>
    //  </ul>
    
    // Save original renderer.
    var renderListitem = renderer.listitem;
    renderer.listitem = function (text) {
        var pattern = /\[\?\?\](.*)/,
            matched = pattern.exec(text);

        if (matched && matched.length === 2) {
            return '<li class="todo-item"><input type="checkbox" />'
                + matched[1]
                + '</li>';
        }

        return renderListitem(text);
    };

    marked.setOptions({renderer: renderer});

    return marked;
};

$([IPython.events]).on('notebook_loaded.Notebook', function () {
    // Since the using marked in IPython doesn't provide
    // rendering overriding, so let's require a new one.
    require(['custom/marked'], function (marked) {
        // Don't forget to re-setup it.
        marked.setOptions(window.marked.options);
        window.marked = patchMarked(marked);
    });
})
