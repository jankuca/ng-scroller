goog.provide('app.FeedRepository');


/**
 * @constructor
 * @ngInject
 */
app.FeedRepository = function () {
  this.cache = [];
  this.cache_ids = [];
};


/**
 * @param {*} next_id The ID of the item before which to fetch the range.
 * @param {number} length The (maximum) number of items to fetch.
 */
app.FeedRepository.prototype.getRangeBefore = function (next_id, length, callback) {
  var cache_after_key = next_id ? goog.array.indexOf(this.cache_ids, next_id) : this.cache.length - 1;
  if (cache_after_key >= length) {
    var items = this.cache.slice(cache_after_key - length, cache_after_key);
    if (items.length === length) {
      setTimeout(function () {
        callback(null, items);
      }, 0);
      return;
    }
  }

  var self = this;
  setTimeout(function () {
    var items = self.generateItems_(50);
    self.cacheItemsBefore_(next_id, items);
    self.getRangeBefore(next_id, length, callback);
  }, 500);
};


/**
 * @param {*} prev_id The ID of the item after which to fetch the range.
 * @param {number} length The (maximum) number of items to fetch.
 */
app.FeedRepository.prototype.getRangeAfter = function (prev_id, length, callback) {
  var cache_before_key = prev_id ? goog.array.indexOf(this.cache_ids, prev_id) : 0;
  if (cache_before_key !== -1 && this.cache.length >= cache_before_key + length) {
    var items = this.cache.slice(cache_before_key + 1, cache_before_key + 1 + length);
    if (items.length === length) {
      setTimeout(function () {
        callback(null, items);
      }, 0);
      return;
    }
  }

  var self = this;
  setTimeout(function () {
    var items = self.generateItems_(50);
    self.cacheItemsAfter_(prev_id, items);
    self.getRangeAfter(prev_id, length, callback);
  }, 500);
};


app.FeedRepository.prototype.generateItems_ = function (length) {
  var items = [];
  for (var i = 0; i < length; ++i) {
    var id = Math.round(Math.random() * 1000000);
    var author = app.FeedRepository.users[Math.floor(Math.random() * app.FeedRepository.users.length)];
    var type = Math.round(Math.random() * 4);
    var item = {
      'id': id,
      'author': author,
      'ago': Math.round(Math.random() * 24) + 'h',
      'favorited': !Math.round(Math.random() * 2),
      'retweeted': !Math.round(Math.random() * 2)
    };
    switch (type) {
    case 0: case 1: case 2:
      item['type'] = 'tweet';
      item['text'] = app.FeedRepository.texts[Math.floor(Math.random() * app.FeedRepository.texts.length)];
      break;
    case 3:
      item['type'] = 'fav';
      item['text'] = 'favorited'
      item['ref'] = {
        'ago': Math.round(Math.random() * 14) + ' days',
        'text': app.FeedRepository.texts[Math.floor(Math.random() * app.FeedRepository.texts.length)]
      };
      break;
    case 4:
      item['type'] = 'rt';
      item['text'] = 'retweeted'
      item['ref'] = {
        'ago': Math.round(Math.random() * 14) + ' days',
        'text': app.FeedRepository.texts[Math.floor(Math.random() * app.FeedRepository.texts.length)]
      };
      break;
    }

    items.push(item);
  }

  return items;
};


app.FeedRepository.prototype.cacheItemsBefore_ = function (next_id, items) {
  var length = items.length;
  var cache_after_key = goog.array.indexOf(this.cache_ids, next_id);

  var cache_splice_args = [ cache_after_key - length, length ].concat(items);
  this.cache.splice.apply(this.cache, cache_splice_args);

  var ids = goog.array.map(items, function (item) {
    return item['id'];
  });
  var cache_ids_splice_args = [ cache_after_key - length, length ].concat(ids);
  this.cache_ids.splice.apply(this.cache_ids, cache_ids_splice_args);
};


app.FeedRepository.prototype.cacheItemsAfter_ = function (prev_id, items) {
  var length = items.length;
  var cache_before_key = goog.array.indexOf(this.cache_ids, prev_id);

  var cache_splice_args = [ cache_before_key + 1, length ].concat(items);
  this.cache.splice.apply(this.cache, cache_splice_args);

  var ids = goog.array.map(items, function (item) {
    return item['id'];
  });
  var cache_ids_splice_args = [ cache_before_key + 1, length ].concat(ids);
  this.cache_ids.splice.apply(this.cache_ids, cache_ids_splice_args);
};



app.FeedRepository.users = [
  {
    "username": "Cumrikova",
    "realname": "Caroline",
    "icon": "https://si0.twimg.com/profile_images/378800000230102256/41d3fd8b9aabcd8e0878dc77da20cca7_normal.jpeg"
  },
  {
    "username": "introvertak",
    "realname": "Deník introverta",
    "icon": "https://si0.twimg.com/profile_images/3061550400/333db34f25cade34fb397daea41023c8_normal.jpeg"
  },
  {
    "username": "juliemikul",
    "realname": "Julie Mikulcova",
    "icon": "https://si0.twimg.com/profile_images/378800000290235593/07a1e778d28b5cb82d88e9a1cf695cfc_normal.jpeg"
  },
  {
    "username": "7801964",
    "realname": "17Black♣",
    "icon": "https://si0.twimg.com/profile_images/378800000280006147/3385ec9223904369e33ead1906f78edf_normal.jpeg"
  },
  {
    "username": "VlaFiser",
    "realname": "Vlastimil Fišer",
    "icon": "https://si0.twimg.com/profile_images/3754924838/4841264ed3404f177b697f752ee64e2e_normal.jpeg"
  },
  {
    "username": "zkracene_adel",
    "realname": "Adéla Dřevikovská",
    "icon": "https://si0.twimg.com/profile_images/378800000265369972/3c4a1ef21cfa0354ce9fab2f24b56ebd_normal.jpeg"
  },
  {
    "username": "XYXXYXYY",
    "realname": "Valentine3",
    "icon": "https://si0.twimg.com/profile_images/378800000236172041/3c13c1f6ef0856bfe86b4bfbebd99978_normal.jpeg"
  },
  {
    "username": "Christie__K",
    "realname": "Chris_K*",
    "icon": "https://si0.twimg.com/profile_images/378800000210468222/8548a9f8ea980245d748471689de7406_normal.jpeg"
  },
  {
    "username": "VJakubec",
    "realname": "Vojtěch Jakubec",
    "icon": "https://si0.twimg.com/profile_images/3493231238/cd6a99e9206ef59a0275994abe91ce40_normal.jpeg"
  },
  {
    "username": "AnnaCeluchova",
    "realname": "Anna Celuchova",
    "icon": "https://si0.twimg.com/profile_images/3010301602/f7a463878675eb343b2ffba48f048c9f_normal.jpeg"
  },
  {
    "username": "KatkaMyskova",
    "realname": "Kačka Myšková ",
    "icon": "https://si0.twimg.com/profile_images/378800000002747590/0bd9b4abb52fac3ecac1330fe56c8483_normal.jpeg"
  },
  {
    "username": "Barunce",
    "realname": "Baruu - Alien girl",
    "icon": "https://si0.twimg.com/profile_images/3736154321/22105795e609397fc1558d501d30f233_normal.jpeg"
  },
  {
    "username": "Domislava",
    "realname": "dommie",
    "icon": "https://si0.twimg.com/profile_images/378800000269947071/47e3eb23251bc936e882c40d7832ba54_normal.jpeg"
  },
  {
    "username": "LuckaFurchova",
    "realname": "Lucka Furchová",
    "icon": "https://si0.twimg.com/profile_images/378800000146504354/f3151974e4f250d5bd14b2e7d24c5966_normal.jpeg"
  },
  {
    "username": "MrsEpicEve",
    "realname": "evička.",
    "icon": "https://si0.twimg.com/profile_images/344513261581000804/de17fd1963a8681344825fdb69c3a407_normal.jpeg"
  },
  {
    "username": "Patrik_cze",
    "realname": "Patrik Jäger",
    "icon": "https://si0.twimg.com/profile_images/3429923380/5ca7f130d9ae23213838d0ed3ad6c64f_normal.jpeg"
  },
  {
    "username": "vynilface",
    "realname": "Terka Vondráčková",
    "icon": "https://si0.twimg.com/profile_images/1216594479/Picture0004__8__normal.jpg"
  },
  {
    "username": "_taprava",
    "realname": "Black Dahlia",
    "icon": "https://si0.twimg.com/profile_images/378800000221683739/f390813c60dde2d33860bf3354c00031_normal.jpeg"
  },
  {
    "username": "PhilipBattin",
    "realname": "Philip Battin",
    "icon": "https://si0.twimg.com/profile_images/269892223/twittericon_battin_normal.jpg"
  }
];

app.FeedRepository.texts = [
  'Well, the way they make shows is, they make one show.',
  'That show\'s called a pilot.',
  'Then they show that show to the people who make shows, and on the strength of that one show they decide if they\'re going to make more shows.',
  'Some pilots get picked and become television programs.',
  'Some don\'t, become nothing.',
  'She starred in one of the ones that became nothing.',
  'Your bones don\'t break, mine do. That\'s clear.',
  'Your cells react to bacteria and viruses differently than mine.',
  'You don\'t get sick, I do. That\'s also clear.',
  'But for some reason, you and I react the exact same way to water.',
  'We swallow it too fast, we choke. We get some in our lungs, we drown.',
  'However unreal it may seem, we are connected, you and I.',
  'We\'re on the same curve, just on opposite ends.',
  'My money\'s in that office, right?',
  'If she start giving me some bullshit about it ain\'t there, and we got to go someplace else and get it.',
  'I\'m gonna shoot you in the head then and there.',
  'Then I\'m gonna shoot that bitch in the kneecaps, find out where my goddamn money is.',
  'She gonna tell me too.',
  'Hey, look at me when I\'m talking to you, motherfucker.',
  'You listen: we go in there, and that nigga Winston or anybody else is in there, you the first motherfucker to get shot.',
  'You understand?',
  'The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men.',
  'Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness…',
  '…for he is truly his brother\'s keeper and the finder of lost children.',
  'And I will strike down upon thee with great vengeance and furious anger those who would attempt to poison and destroy My brothers.',
  'And you will know My name is the Lord when I lay My vengeance upon thee.'
];
