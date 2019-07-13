
    (function (base) {
        base.typeAhead = {
            init: function (options) {
                var _after = options.after;
                var _onselect = options.onSelect;
                var _onRemove = options.onRemove;
                var _tagMode = options.tagMode || false;
                var _binded = '#' + options.bind;
                var _containerId = 'type_ahead_container_' + $.now() + '_' + options.bind;
                var _container = '#' + _containerId;
                var _timeout = options.timeout || 300;
                var _params = options.params;
                var _method = options.method || 'GET';
                var _listingTemplate = options.template;
                var _timer, _xhrRequest = null;
                var _label = undefined;
                var _limit = 9999;
                var _disabled = false;
                var _afterTag = null;
                var _key = options.key;
                var _duplicate = typeof options.duplicate === 'boolean' ? options.duplicate : true;
                var _auto = typeof options.auto === 'boolean' ? options.auto : false;
                var _source = options.source;
                var _containerClass = options.styleClass || '';
                var _focusedColor = options._focusedColor || '#f3f5fc';
                if (!$(_binded)[0]) { console.warn('Could not bind type ahead in provided element(' + _binded + ')'); return; }
                var _warnings = function () {
                    console.warn('Duplicate check needed to implement');
                    //if (app.Debug.HasDuplicate(options.bind)) {
                    //    console.warn('Binded object(' + _binded + ') has multiple findings in the DOM. Please use a unique binding preferably ID attribute');
                    //}
                };
                if (options.tag) {
                    _label = options.tag.label;
                    _limit = options.tag.limit;
                    _afterTag = options.tag.afterTag;
                }
                //show warnings if any
                _warnings();

                var mainContainerClass = (_tagMode ? "type-ahead-search-container tag-mode" : "type-ahead-search-container") + ' ' + _containerClass;
                $(_binded).attr('autocomplete', 'off');
                $(_binded)[0].style.setProperty('min-width', '75px', 'important');
                $(_binded)[0].style.setProperty('background-color', 'transparent', 'important');
                $(_binded).wrap('<div class="' + mainContainerClass + '" id="' + _containerId + '"></div>');
                $(_binded).after('<div style="display:none" class="type-ahead-search-result-container"></div>');
                if (_tagMode) {
                    $(_binded).wrap('<div class="type-ahead-tag-result-container"></div>');
                }


                const _renderHtml = function (array) {
                    $(_container).find('.type-ahead-search-result-container').html('').hide();
                    var box = $('<ul class="type-ahead-search-result-lists"></ul>');
                    if (!array || array.length < 1) {
                        box.html('<li class="type-ahead-search-result-empty"><p style="text-align: center;color: #ff6f6f;padding: 1.3em 0 0.5em;">No result found</p></li>');
                        $(_container).find('.type-ahead-search-result-container').append(box).show();
                        //setTimeout(function () {
                        //    $(_container).find('.type-ahead-search-result-container').html('').hide();
                        //}, 1000);
                        return;
                    }
                    var currenttags = _getSelected();
                    var firstItemAdded = false;
                    for (var j = 0; j < array.length; j++) {
                        var item = array[j];
                        var exists = false;
                        if (!_duplicate) {
                            for (let i = 0; i < currenttags.length; i++) {
                                if (_key && item[_key] === currenttags[i][_key]) {
                                    exists = true;
                                    break;
                                }
                                if (item === currenttags[i]) {
                                    exists = true;
                                    break;
                                }

                            }
                            if (exists) continue;
                        }
                        var html = '';

                        html += '<li class="type-ahead-search-result-item ' + (!firstItemAdded ? 'is-focused" style="background-color:' + _focusedColor + '"' : '"') + '>';
                        firstItemAdded = true;
                        //render template
                        if (typeof _listingTemplate === 'function') {
                            html += _listingTemplate(item);
                        }
                        else {
                            //html += '<div class="media"> <div class="media-body"> <h4 class="media-heading">' + item.NameEN + '</h4><ul class="media-list"> <li><span class="app-icon icon-military-icon-01 icon-yellow"></span>' + item.MilitaryNumber + '</li> <li><span class="app-icon icon-Department"></span>' + item.Designation.EnglishName + '</li> <li><span class="app-icon icon-Designation"></span>' + item.Department.NameEn + '</li> </ul> </div> </div>';

                            //html += '<div class="type-ahead-default__list-item"><div><h5 class="type-ahead-default__list-item--title">' + (lang === 'en' ? item.NameEN : item.NameAR) + '</h5><small class="type-ahead-default__list-item--dept"><span class="icon-designation app-icon app-head-icon-1"></span>' + (lang === 'en' ? item.Department.NameEn : item.Department.NameAr) + '</small></div><div><span class="app-icon icon-military-icon-01 icon-yellow"></span> <span class="type-ahead-default__list-item--military">' + item.MilitaryNumber + '</span></div></div>';
                            console.warn('Could not find a suitable template for listing results');
                            return;

                        }

                        html += '</li>';
                        var list_item = $(html);
                        list_item.data('objectkey', item);
                        box.append(list_item);
                    }
                    $(_container).find('.type-ahead-search-result-container').append(box).show();
                };
                $(document).off('keydown.type-ahead', _binded).on('keydown.type-ahead', _binded, function (e) {
                    var key = e.which || e.keyCode;
                    let focused = $(_container).find('.type-ahead-search-result-item.is-focused');
                    var searchBox = $(_container).find(".type-ahead-search-result-lists");
                    if (key === 13) {
                        e.preventDefault();
                        focused.trigger('click');
                    }
                    else if (key === 40 || key === 38) {
                        if (key === 40) {
                            e.preventDefault();
                            //down arrow key
                            focused.next('.type-ahead-search-result-item').addClass('is-focused', {
                                complete: () => focused.removeClass('is-focused').css('background-color', ''),
                                duration: 0
                            }).css('background-color', _focusedColor);
                        }
                        else {
                            //up arrow key
                            e.preventDefault();
                            focused.prev('.type-ahead-search-result-item').addClass('is-focused', {
                                complete: () => focused.removeClass('is-focused').css('background-color', ''),
                                duration: 0
                            }).css('background-color', _focusedColor);
                        }
                        searchBox.scrollTop(0);//set to top
                        searchBox.scrollTop(focused.offset().top - searchBox.height());
                    }
                    //else if (key === 27) {
                    //    e.stopPropagation();
                    //    $(_container).find('.type-ahead-search-result-container').html('').hide();
                    //}                    
                    else if (key === 9) {
                        e.stopPropagation();
                        $(_container).find('.type-ahead-search-result-container').html('').hide();
                    }
                    else {
                        //all other keys

                        if (key === 8) {//if user pressed Backspace remove last tag
                            var val = $(_binded).val();
                            if (!val) {
                                var tag = $(_container).find('.type-ahead-tag-item:last');
                                var d = tag.data('item');
                                tag.remove();
                                if (typeof _onRemove === 'function') {
                                    _onRemove(d);
                                }
                                return;
                            }
                        }
                        //redrawing textbox width
                        if (_tagMode) {
                            var len = $(_binded).val().length + '5px';
                            $(_binded)[0].style.setProperty('width', len, 'important');
                        }


                        //$(_binded).css("cssText", "width: "+len+" !important;");

                        //Data populated from static source
                        if (_source && Array.isArray(_source) && _source.length > 0) {
                            _renderHtml(_source);
                        }
                        else { //data populated from remote call
                            clearTimeout(_timer);
                            if (_xhrRequest !== null) _xhrRequest.abort();


                            //timeout wrapper for waiting for user to finish typing
                            _timer = setTimeout(function () {
                                //building url
                                var _url = options.url || '/Account/Police/search';
                                for (var i = 0; i < _params.length; i++) {
                                    if (i === 0) _url += '?';
                                    _url += _params[i].name + '=' + _params[i].value() + '&';
                                }
                                //fetch data
                                _xhrRequest = app.Provider.GetAsync({
                                    url: _url,
                                    success: function (data) {
                                        if (!data) return;
                                        _renderHtml(data.Data);
                                    }
                                });


                            }, _timeout);
                        }
                    }
                });

                var _renderTag = function (underlyingdata) {
                    if (_tagMode) {
                        var tag = null;
                        if (typeof _label === 'function') {

                            tag = $('<span class="type-ahead-tag-item">' + _label(underlyingdata) + '<a href="#" class="type-ahead-tag-remove">x</a></span>');
                        }
                        else if (_label){
                            tag = $('<span class="type-ahead-tag-item">' + underlyingdata[_label] + '<a href="#" class="type-ahead-tag-remove">x</a></span>');
                        }
                        else {
                            tag = $('<span class="type-ahead-tag-item">' + underlyingdata + '<a href="#" class="type-ahead-tag-remove">x</a></span>');
                        }
                        tag.data('item', underlyingdata);
                        $(_binded).before(tag);

                        //callback event after tagging
                        try { if (_afterTag) _afterTag(underlyingdata); } catch (e) { console.error(_afterTag); }
                    }
                };

                $(document).off('click.type-ahead', _container + ' .type-ahead-search-result-item').on('click.type-ahead', _container + ' .type-ahead-search-result-item', function (e) {
                    e.stopPropagation();
                    var underlyingdata = $(this).data('objectkey');
                    var tags = $(_container).find('.type-ahead-tag-item');
                    if (tags.length === _limit) {
                        tags.last().remove();
                    }
                    $(_binded).data('lastSelected', underlyingdata);
                    $(_container).find('.type-ahead-search-result-container').html('').hide();

                    _renderTag(underlyingdata);

                    $(_binded).val('');
                    try {
                        if (typeof _onselect === 'function') {
                            _onselect(underlyingdata);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    $(_binded).focus();
                });
                $(document).off('click.type-ahead', _container + ' .type-ahead-tag-remove').on('click.type-ahead', _container + ' .type-ahead-tag-remove', function (e) {
                    e.stopPropagation();
                    if (_disabled) return;
                    var d = $(this).data('item');
                    $(this).closest('.type-ahead-tag-item').remove();
                    if (typeof _onRemove === 'function') {
                        _onRemove(d);
                    }
                });
                $(document).off('click.type-ahead', _container).on('click.type-ahead', _container, function (e) {
                    e.stopPropagation();
                    if (_disabled) return;
                    $('.type-ahead-search-result-container').html('').hide();
                    $(_binded).focus();
                    _auto && $(_binded).trigger('keydown');
                });
                $(window).off('click.type-ahead').on('click.type-ahead',function () {
                    $(_container).find('.type-ahead-search-result-container').html('').hide();
                    $(_binded).val('');
                });

                var _getSelected = function () {
                    var tags = $(_container).find('.type-ahead-tag-item');
                    return Array.from(tags, function (x) { return $(x).data('item'); });
                };
                var _getLastSelected = function () {
                    return $(_binded).data('lastSelected');
                };
                //returning subsequent operation bounded object;
                return {

                    getSelected: function () {

                        return _getSelected();
                    },

                    getLastSelected: function () {
                        return _getLastSelected();
                    },

                    setData: function (data) {
                        if (data) {
                            if (Array.isArray(data)) {
                                for (let i = 0; i < data.length; i++) {
                                    //logic here
                                    _renderTag(data[i]);
                                }
                                $(_binded).data('lastSelected', data[data.length - 1]);
                            }
                            else {
                                _renderTag(data);
                                $(_binded).data('lastSelected', data);
                            }

                        }
                    },
                    disable: function () {
                        _disabled = true;
                        $(_binded).attr('disabled', 'disabled');
                        $(_container).find('.type-ahead-tag-remove').hide();
                    },
                    enable: function () {
                        _disabled = false;
                        $(_binded).removeAttr('disabled');
                        $(_container).find('.type-ahead-tag-remove').show();
                    },
                    removeAll: function () {
                        $(_container).find('.type-ahead-tag-remove').trigger('click');
                    },
                    remove: function (start, limit) {
                        let tags = $(_container).find('.type-ahead-tag-remove');
                        if (arguments.length === 0) {
                            tags.trigger('click');
                        }
                        else {
                            let _start = 0;
                            let _limit = 0;
                            if (arguments.length === 1) {
                                _limit = arguments[0];
                            }
                            else {
                                _start = arguments[0];
                                _limit = arguments[1];
                            }
                            let _count = 0;
                            let _filtered = tags.filter(function (index, item) {
                                if (index >= _start) {
                                    if (_count < _limit) {
                                        _count++;
                                        return true;
                                    }
                                }
                                return false;
                            });
                            _filtered.trigger('click');
                        }

                    },
                    get length() {
                        return $(_container).find('.type-ahead-tag-item').length;
                    },
                    destroy: function () {
                        //unbinding events
                        $(document).off('keydown.type-ahead', _binded);
                        $(document).off('click.type-ahead', _container + ' .type-ahead-search-result-item');
                        $(document).off('click.type-ahead', _container + ' .type-ahead-tag-remove');
                        $(document).off('click.type-ahead', _container);
                        $(window).off('click.type-ahead');

                        //clearing selections if any
                        $(_container).find('.type-ahead-tag-item').remove();
                        $(_binded).data('lastSelected',null);
                    }
                };
            },
            getLastSelected: function (_binded) {
                return $(_binded).data('lastSelected');
            },
            getSelected: function (_binded) {
                var tags = $(_binded).closest('.type-ahead-search-container').find('.type-ahead-tag-item');
                return Array.from(tags, function (x) { return $(x).data('item'); });
            },
            removeAll: function (_binded) {
                $(_binded).closest('.type-ahead-search-container').find('.type-ahead-tag-remove').trigger('click');
            }

        };
    })(window);
