var patchMarked = function (marked) {
    var renderer = new marked.Renderer();

    // Add `todo list` support to listitem
    // e.g.:
    //  
    //  - [?] fix this link
    //  - [x] read some books
    //
    // should be rendered into:
    //
    //  <ul>
    //      <li class="todo-item"><input type="checkbox" />fix this link</li>
    //      <li class="todo-item"><input type="checkbox" checked />read some books</li>
    //  </ul>
    
    // Save original renderer.
    var renderListitem = renderer.listitem;
    renderer.listitem = function (text) {
        var pattern = /\[([\?xX])](.*)/,
            matched = pattern.exec(text),
            status;

        if (matched) {
            status = matched[1].toLowerCase();
            if (status === 'x') {
                status = '<input type="checkbox" checked disabled />';
            } else if (status === '?') {
                status = '<input type="checkbox" disabled />';
            }
            return '<li class="todo-item">'
                + status + matched[2]
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
