
$(function () {
  x = console.log.bind(console);
  x(CKEDITOR);
    if (typeof CKEDITOR !== 'undefined') {

        CKEDITOR.replaceAll(function (textarea, config) {
            // exclude textareas that are inside hidden inline rows
            //if ($(textarea).parents('tr').hasClass('blank')) return false;
            // textareas with this class name will get the default configuration
            //if (textarea.className.indexOf('ck-full') != -1) return true;
            // textareas with this class name will have custom configuration
          //  x = console.log.bind(console);
          //  x('test!!!!!!');

            console.log(setCustomConfig());
            if (textarea.className.indexOf('ck-compact') != -1)
                  return setCustomConfig(config);

            // all other textareas won't be initialized as ckeditors
            return false;
        });

        // upload image dialog
         CKEDITOR.on('dialogDefinition', function (e) {
            // Take the dialog name and its definition from the event data.
            var dialogDefinition = e.data.definition,
                uploadTab = dialogDefinition.getContents('Upload');

            if (uploadTab) {
                // add the _csrf token to the request
                uploadTab.elements[0].action
                    += '&_csrf='+ encodeURIComponent($('[name=_csrf]').val());
            }
        });
    }

    if (typeof tinyMCE !== 'undefined') {
        // it's important to initialize only the visible textareas
        $('tr:not(.blank) .tinymce').tinymce({});
    }
});

// ckeditor only
function onUpload (src) {
  //  $('.cke_dialog_contents label.cke_required:contains("URL") + div div input').val(src);
  //  $('.cke_dialog_ui_button_ok')[0].click();
}

// ckeditor only
function setCustomConfig (config) {
    config = config || {};
    // BRITIN
    console.log(config);

    //config.id = 'editor'
    // upload images
    //CKEDITOR.config.filebrowserUploadUrl = '/upload';
    // toolbar
/*
<script>BalloonBlockEditor
    .create( document.querySelector( '.editor' ), {

      toolbar: {
        items: [
        ]
      },
      language: 'ru',
      blockToolbar: [
        'restrictedEditing',
        'trackChanges',
        'removeFormat',
        'undo',
        'redo'
      ],
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
          'tableCellProperties',
          'tableProperties'
        ]
      },
      licenseKey: '',

      } )
    .then( editor => {
      window.editor = editor;








    } )
    .catch( error => {
      console.error( 'Oops, something went wrong!' );
      console.error( 'Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:' );
      console.warn( 'Build id: 3n5dpnin9up8-7pr5z684811h' );
      console.error( error );
    } );
</script>
*/
    //CKEDITOR.config.toolbar = {items: ['undo','redo']};
    /*config.toolbar = {
      items: ['undo','redo']
    };*/
/*    config.toolbarGroups = [
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align' ] },
        '/',
        { name: 'styles' },
        { name: 'colors' },
        { name: 'insert' }
    ];
    config.removeButtons = 'Smiley,SpecialChar,PageBreak,Iframe,CreateDiv,Table,Flash,HorizontalRule';
*/
    return config;
}

// executed each time an inline is added
function onAddInline (rows) {
    if (typeof CKEDITOR !== 'undefined') {
        // for each of the new rows containing textareas
        $('textarea', rows).each(function (index) {
            // get the DOM instance
            var textarea = $(this)[0];

            // textareas with this class name will get the default configuration
            //if (textarea.className.indexOf('ck-full') != -1) return CKEDITOR.replace(textarea);
            // textareas with this class name will have custom configuration
            if (textarea.className.indexOf('ck-compact') != -1)
                console.log(CKEDITOR);
                console.log(setCustomConfig());
                return CKEDITOR.replace(textarea, setCustomConfig());
            // all other textareas won't be initialized as ckeditors
            return false;
        });
    }

    if (typeof tinyMCE !== 'undefined') {
        // init tinymce editors
        //$('.tinymce', rows).tinymce({});
    }
}
