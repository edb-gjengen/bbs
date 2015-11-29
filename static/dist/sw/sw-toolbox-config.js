toolbox.router.get('/(.*)/picture/', toolbox.fastest, {
    origin: /^https:\/\/graph\.facebook\.com$/
});

//var MISSING_IMAGE = '/static/dist/images/unknown_person.png';
//toolbox.cache(MISSING_IMAGE);
//
//function imageHandler(request, values, options) {
//    return toolbox.cacheFirst(request, values, options).catch(function () {
//        return caches.match(MISSING_IMAGE);
//    });
//}