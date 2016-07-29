        //计算左右分区的范围
        function range() {

            var range = {
                left: { x: [], y: [] },
                right: { x: [], y: [] }
            };

            var wrap = {
                w: g('#wrap').clientWidth,
                h: g('#wrap').clientHeight,
            };
            var photo = {
                w: g('.photo')[0].clientWidth,
                h: g('.photo')[0].clientHeight,
            };

            range.wrap = wrap;
            range.photo = photo;

            range.left.x = [0 - photo.w, wrap.w / 2 - photo.w / 2];
            range.left.y = [0 - photo.h, wrap.h];

            range.right.x = [wrap.w / 2 + photo.w / 2, wrap.w + photo.w];
            range.right.y = [0 - photo.h, wrap.h];

            return range;
        };
        //根据类名和ID取值的通用函数
        function g(selector) {
            var method = selector.substr(0, 1) == '.' ? 'getElementsByClassName' : 'getElementById';
            return document[method](selector.substr(1));
        };
        //增加一个产生随机数的函数
        function random(range) {
            var max = Math.max(range[0], range[1]);
            var min = Math.min(range[0], range[1]);
            var diff = max - min;
            return Math.ceil(Math.random() * diff + min);
        };
        //图片显示函数
        function rsort(n) {
            var photos = g('.photo');
            var photo = [];

            for (var i = 0; i < photos.length; i++) {
                photos[i].className = photos[i].className.replace(/\s*photo_center\s*/, ' ');
                photos[i].className = photos[i].className.replace(/\s*photo_front\s*/, ' ');
                photos[i].className = photos[i].className.replace(/\s*photo_back\s*/, ' ');

                photos[i].className += ' photo_front ';
                photos[i].style.top = '';
                photos[i].style.left = '';
                photos[i].style['-webkit-transform'] = 'rotate(0deg) scale(1.5)';
            };
            var photo_center = g('#photo_' + n);
            photo_center.className += ' photo_center ';

            photo = Array.prototype.slice.call(photos);
            photo_center = photo.splice(n, 1)[0];
            
            var photoleft = photo.splice(0, Math.ceil(photo.length/2));
            var photoRight = photo;

            var ranges = range();
            for (var i = 0; i < photoleft.length; i++) {
                photoleft[i].style.top = random(ranges.left.y)+'px';
                photoleft[i].style.left = random(ranges.left.x) + 'px';
                photoleft[i].style['-webkit-transform'] = 'rotate('+random([-150,150])+'deg) scale(1)';
            };
            for (var j = 0; j < photoRight.length; j++) {
                photoRight[j].style.top = random(ranges.right.y)+'px';
                photoRight[j].style.left = random(ranges.right.x) + 'px';
                photoRight[j].style['-webkit-transform'] = 'rotate(' + random([-150, 150]) + 'deg) scale(1)';
            };
            //控制按钮和图片的关联
            var navs = g('.i');
            for (var s = 0; s < navs.length; s++) {
                navs[s].className = navs[s].className.replace(/\s*i_current\s*/, ' ');
                navs[s].className = navs[s].className.replace(/\s*i_back\s*/, ' ');
            };
            g('#nav_' + n).className += ' i_current ';
        };
        //增加图片函数
        function addPhotos() {
            var photo = g('.wrap');
            var template = photo[0].innerHTML;
            var photos = [];
            var nav = [];

            for (s in data) {
                var html = template.replace('{{id}}', s)
                                                   .replace('{{img}}', data[s].img)
                                                   .replace('{{caption}}', data[s].caption)
                                                   .replace('{{desc}}', data[s].desc);
                photos.push(html);
                nav.push('<span id="nav_'+s+'" onclick="turn( g(\'#photo_'+s+'\') )" class="i"></span>');
            };
            photos.push('<div class="nav">'+nav.join('')+'</div>')
            photo[0].innerHTML = photos.join(' ');
            rsort(random([0,data.length]));
        };
        addPhotos();
        //翻面控制函数
        function turn(elem) {
            var cls = elem.className;
            var n = elem.id.split('_')[1];

            if (!/photo_center/.test(cls)) {
                rsort(n);
            };

            if (/\s*photo_front\s*/.test(cls)) {
                elem.className = elem.className.replace(/\s*photo_front\s*/, ' photo_back ');
                g('#nav_' + n).className += ' i_back ';
            } else {
                elem.className = elem.className.replace(/\s*photo_back\s*/, ' photo_front ');
                g('#nav_' + n).className = g('#nav_' + n).className.replace(/\s*i_back\s*/, ' ');
            };
        };