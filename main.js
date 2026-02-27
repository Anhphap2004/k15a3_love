/* ============================================
   K15A3 - TUỔI HỌC TRÒ - MAIN JAVASCRIPT
   ============================================ */

// ---- Tab Navigation ----
function switchTab(tabName) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  window.scrollTo({ top: document.querySelector('.nav-sticky').offsetTop, behavior: 'smooth' });
  if (tabName === 'donation') initDonation();
  if (tabName === 'gallery') initGallery();
  if (tabName === 'members') initMembers();
  if (tabName === 'intro') initIntersectionObserver();
}

// ---- Members Data ----
const MEMBERS = {
  female: [
    { name: 'Hoàng Quỳnh An',         donation: 400000 },
    { name: 'Đặng Ngọc Ánh',           donation: 0      },
    { name: 'Nguyễn Thị Linh Chi',     donation: 0      },
    { name: 'Nguyễn Thị Dương',        donation: 0      },
    { name: 'Phạm Thị Hải',          donation: 100000 },
    { name: 'Nguyễn Thị Hằng',         donation: 0      },
    { name: 'Nguyễn Thị Kim Anh',      donation: 200000 },
    { name: 'Nguyễn Thị Hồng',         donation: 0      },
    { name: 'Võ Thị Mùi',              donation: 0      },
    { name: 'Trương Ngọc Nhi',         donation: 0      },
    { name: 'Phan Yến Nhi',      donation: 0      },
    { name: 'Đào Hải Uyên',            donation: 0      },
    { name: 'Út Trà',                  donation: 0      },
    { name: 'Lê Thị Thanh Xuyến',      donation: 100000 },
    { name: 'Nguyễn Thương',           donation: 0      },
    { name: 'Hoài Thu',                donation: 0      },
    { name: 'Phạm Thị Chuyên',         donation: 0      },
    { name: 'Trần Trà My',             donation: 0      },
    { name: 'Nguyễn Thị Anh Ngọc',    donation: 0      },
    { name: 'Nguyễn Thị Hiền',         donation: 200000 },
    { name: 'Nguyễn Thị Thanh Hiền',  donation: 0      },
    { name: 'Phương Nguyễn',           donation: 0      },
    { name: 'Lê Thị Tâm',              donation: 0      },
    { name: 'C Hoà',                   donation: 0      },
    { name: 'Hồ Thiên Nga',            donation: 200000     },
    { name: 'Tăng Thị Lê Na',          donation: 200000      },
    { name: 'Phan Thục Nguyên',        donation: 0      },
    { name: 'Nguyễn Thị Lộc',          donation: 100000 },
    { name: 'Nguyễn Hoàng Kiều Khanh', donation: 200000 },
  ],
  male: [
    { name: 'Anhh Phapp',        donation: 456789 },
    { name: 'Nguyễn Văn Kiểm',  donation: 400000 },
    { name: 'Lê Trọng Nghĩa',   donation: 300000 },
    { name: 'Đặng Việt Đức',    donation: 0       },
    { name: 'Nguyễn Trung Đô',  donation: 200000 },
    { name: 'Lê Quang Huy',     donation: 0       },
    { name: 'Trần Văn Lực',     donation: 200000 },
    { name: 'Nguyễn Đình Thành',donation: 200000 },
    { name: 'Nguyễn Công Nhất', donation: 0       },
    { name: 'Nguyễn Đình Mạnh', donation: 0       },
    { name: 'Đặng Văn Khoa',    donation: 0       },
    { name: 'Phan Quyết Anh',   donation: 0       },
    { name: 'Nguyễn Minh Quân', donation: 100000  },
  ]
};

// Photo helpers and local assets

const MEMBER_PHOTO_MAP = {
  'Hoàng Quỳnh An': 'images/quynhan.jpg',
  'Đặng Ngọc Ánh': 'images/dangngocanh.jpg',
  'Nguyễn Thị Linh Chi': 'images/linhchi.jpg',
  'Nguyễn Thị Dương': 'images/nguyenthiduong.jpg',
  'Phạm Thị Hải': 'images/nguyenthihai.jpg',
  'Nguyễn Thị Hằng': 'images/nguyenthihang.jpg',
  'Nguyễn Thị Kim Anh': 'images/kimanh.png',
  'Nguyễn Thị Hồng': 'images/hong.jfif',
  'Võ Thị Mùi': 'images/vothimui.jpg',
  'Trương Ngọc Nhi': 'images/trungngocnhi.jpg',
  'Phan Yến Nhi': 'images/phanyennhi.png',
  'Đào Hải Uyên': 'images/daohaiuyen.jpg',
  'Út Trà': 'images/uttra.png',
  'Lê Thị Thanh Xuyến': 'images/lethithanhxuyen.jpg',
  'Nguyễn Thương': 'images/anhdang.jpg',
  'Hoài Thu': 'images/hoaithu.jpg',
  'Phạm Thị Chuyên': 'images/phamthichuyen.jpg',
  'Trần Trà My': 'images/tramy.jpg',
  'Nguyễn Thị Anh Ngọc': 'images/anhngoc.jpg',
  'Nguyễn Thị Hiền': 'images/nguyenthihien.png',
  'Nguyễn Thị Thanh Hiền': 'images/thanhhien.jpg',
  'Phương Nguyễn': 'images/phuongnguyen.png',
  'Lê Thị Tâm': 'images/lethitam.jpg',
  'C Hoà': 'images/choa.png',
  'Hồ Thiên Nga': 'images/hothiennga.png',
  'Tăng Thị Lê Na': 'images/tangthilena.jpg',
  'Phan Thục Nguyên': 'images/phanthucnguyen.jpg',
  'Nguyễn Thị Lộc': 'images/nguyenthiloc.jpg',
  'Nguyễn Hoàng Kiều Khanh': 'images/kieukhanh.jpg',
  'Anhh Phapp': 'images/AnhhPhapp.jpg',
  'Nguyễn Văn Kiểm': 'images/nkiem.jpg',
  'Lê Trọng Nghĩa': 'images/trongnghia.jpg',
  'Đặng Việt Đức': 'images/dangvietduc2.jpg',
  'Nguyễn Trung Đô': 'images/trungdo.jpg',
  'Lê Quang Huy': 'images/quanghuy.jpg',
  'Trần Văn Lực': 'images/tranvanluc.jpg',
  'Nguyễn Đình Thành': 'images/nguyendinhthanhh.jpg',
  'Nguyễn Công Nhất': 'images/nguyencongnhat.jpg',
  'Nguyễn Đình Mạnh': 'images/dinhmanh.jpg',
  'Đặng Văn Khoa': 'images/dangvankhoa.jpg',
  'Phan Quyết Anh': 'images/phanquyetanh.jpg',
  'Nguyễn Minh Quân': 'images/nguyenminhquan.jpg',
};

const DEFAULT_MEMBER_PHOTO = {
  female: 'images/hoaithu.jpg',
  male: 'images/AnhhPhapp.jpg',
};

// Social links map: { 'Tên': { fb: 'link_fb', zalo: 'link_zalo' } }
const MEMBER_SOCIAL_MAP = {
  'Hoàng Quỳnh An':           { fb: 'https://www.facebook.com/profile.php?id=61581759576788#', zalo: '0' },
  'Đặng Ngọc Ánh':             { fb: 'https://www.facebook.com/anh.ang.120408', zalo: '0' },
  'Nguyễn Thị Linh Chi':       { fb: 'https://www.facebook.com/profile.php?id=100037087776141', zalo: '0' },
  'Nguyễn Thị Dương':          { fb: 'https://www.facebook.com/nguyen.thi.duong.55188', zalo: '0' },
  'Phạm Thị Hải':            { fb: 'https://www.facebook.com/phamthihai.73157', zalo: '0' },
  'Nguyễn Thị Hằng':           { fb: 'https://www.facebook.com/terexa.hang.2025', zalo: '0' },
  'Nguyễn Thị Kim Anh':        { fb: 'https://www.facebook.com/anktrung.04', zalo: '0' },
  'Nguyễn Thị Hồng':           { fb: 'https://www.facebook.com/hong.nt.1694#', zalo: '0' },
  'Võ Thị Mùi':                { fb: 'https://www.facebook.com/mui.vo.5030', zalo: '0' },
  'Trương Ngọc Nhi':           { fb: 'https://www.facebook.com/nhi.truong.743643', zalo: '0' },
  'Phan Yến Nhi':        { fb: 'https://www.facebook.com/yennhi.phanthi.16144', zalo: '0' },
  'Đào Hải Uyên':              { fb: 'https://www.facebook.com/yennhi.phanthi.16144', zalo: '0' },
  'Út Trà':                    { fb: 'https://www.facebook.com/angthiuttra', zalo: '0' },
  'Lê Thị Thanh Xuyến':        { fb: 'https://www.facebook.com/lethithanhxuyen', zalo: '0' },
  'Nguyễn Thương':             { fb: 'https://www.facebook.com/nguyen.thuong.572660', zalo: '0' },
  'Hoài Thu':                  { fb: 'https://www.facebook.com/hoai.thu.940174', zalo: '0' },
  'Phạm Thị Chuyên':           { fb: 'https://www.facebook.com/pham.thi.chuyen.80330', zalo: '0' },
  'Trần Trà My':               { fb: 'https://www.facebook.com/tramy.trannguen.1', zalo: '0' },
  'Nguyễn Thị Anh Ngọc':      { fb: 'https://www.facebook.com/ngoc.chery.564', zalo: '0' },
  'Nguyễn Thị Hiền':           { fb: 'https://www.facebook.com/ngoc.chery.564', zalo: '0' },
  'Nguyễn Thị Thanh Hiền':    { fb: 'https://www.facebook.com/profile.php?id=100023313194483', zalo: '0' },
  'Phương Nguyễn':             { fb: 'https://www.facebook.com/phuong.nguyen.984775', zalo: '0' },
  'Lê Thị Tâm':                { fb: 'https://www.facebook.com/tam.le.669532', zalo: '0' },
  'C Hoà':                     { fb: 'https://www.facebook.com/huongduongntth', zalo: '0' },
  'Hồ Thiên Nga':              { fb: 'https://www.facebook.com/honga1508', zalo: '0' },
  'Tăng Thị Lê Na':            { fb: 'https://www.facebook.com/tang.thi.le.na', zalo: '0' },
  'Phan Thục Nguyên':          { fb: 'https://www.facebook.com/search/top?q=phan%20th%E1%BB%A5c%20nguy%C3%AAn', zalo: '0' },
  'Nguyễn Thị Lộc':            { fb: 'https://www.facebook.com/nguyen.thi.loc.246622', zalo: '0' },
  'Nguyễn Hoàng Kiều Khanh':   { fb: 'https://www.facebook.com/profile.php?id=100081158735558', zalo: '0' },
  'Anhh Phapp':                { fb: 'https://www.facebook.com/AnhPhapp24/', zalo: '' },
  'Nguyễn Văn Kiểm':          { fb: 'https://www.facebook.com/nguyen.kiem.172763', zalo: '0' },
  'Lê Trọng Nghĩa':           { fb: 'https://www.facebook.com/le.trong.nghia.262819', zalo: '0' },
  'Đặng Việt Đức':             { fb: 'https://www.facebook.com/hello.mr.duck', zalo: '0' },
  'Nguyễn Trung Đô':          { fb: 'https://www.facebook.com/profile.php?id=61577026611132', zalo: '0' },
  'Lê Quang Huy':              { fb: 'https://www.facebook.com/guang.hui.5204', zalo: '0' },
  'Trần Văn Lực':              { fb: 'https://www.facebook.com/luctran0212', zalo: '0' },
  'Nguyễn Đình Thành':        { fb: 'https://www.facebook.com/thanh.inh.970336', zalo: '0' },
  'Nguyễn Công Nhất':         { fb: 'https://www.facebook.com/thanh.inh.970336', zalo: '0' },
  'Nguyễn Đình Mạnh':         { fb: 'https://www.facebook.com/manhz14', zalo: '0' },
  'Đặng Văn Khoa':             { fb: 'https://www.facebook.com/khoa.docle.18', zalo: '0' },
  'Phan Quyết Anh':            { fb: 'https://www.facebook.com/anh.phanquyet.90', zalo: '0' },
  'Nguyễn Minh Quân':         { fb: 'https://www.facebook.com/nmquan.1808', zalo: '0' },
};

// Gallery photos - from images/kiniem folder (kỉ niệm)
const GALLERY_PHOTOS = [
  { src: 'images/kiniem/105978989_274230313905286_1810176920617859179_n_274230193905298.jpg', cap: 'Kỷ niệm lớp K15A3' },
  { src: 'images/kiniem/106133745_267637344691705_2853704690707403679_n_267637268025046.jpg', cap: 'Đàn em Hương Sử' },
  { src: 'images/kiniem/106169437_2765758056986842_6893750172118842312_n_2765757956986852.jpg', cap: 'Những khoảnh khắc đáng nhớ' },
  { src: 'images/kiniem/106361074_987455041713624_5374908379126046071_n_987455035046958.jpg', cap: 'Cùng nhau học tập' },
  { src: 'images/kiniem/121816906_668583434054153_2126525873472427291_n_668583387387491.jpg', cap: 'Tiết học thú vị' },
  { src: 'images/kiniem/122922102_684440158853435_1697737890112733586_n_684439955520122.jpg', cap: 'Tuổi học trò' },
  { src: 'images/kiniem/125183154_493407028213597_4224002653697888658_n_493407021546931.jpg', cap: 'Lớp K15A3' },
  { src: 'images/kiniem/125183935_3624729430910539_6750363075165862546_n_3624729427577206.jpg', cap: 'Hoạt động ngoại khoá' },
  { src: 'images/kiniem/125204613_3332420523522326_2690508916514022350_n_3332420520188993.jpg', cap: 'Tình bạn mãi mãi' },
  { src: 'images/kiniem/125370301_289653218964766_7972761101914597555_n_289653212298100.jpg', cap: 'Niềm vui học đường' },
  { src: 'images/kiniem/125469136_795756751155472_973824814579621322_n_795756741155473.jpg', cap: 'Cô Hương và lớp' },
  { src: 'images/kiniem/125956945_182268566831316_2903521565009849133_n_182268563497983.jpg', cap: 'Hành trình K15A3' },
  { src: 'images/kiniem/126159551_129434152067308_1925914713065918311_n_129434112067312.jpg', cap: 'Bạn bè thân thiết' },
  { src: 'images/kiniem/126179277_280242860095010_1434410424626983313_n_280242856761677.png', cap: 'Những nụ cười' },
  { src: 'images/kiniem/126401179_715671709050845_8066091169962368505_n_715671705717512.jpg', cap: 'Ký ức học trò' },
  { src: 'images/kiniem/126525380_828419021269902_5664855755524211106_n_828419017936569.jpg', cap: 'Tuổi hồng' },
  { src: 'images/kiniem/129348956_407201107070657_1718354688721404145_n_407201100403991.jpg', cap: 'K15A3 mãi mãi' },
  { src: 'images/kiniem/129378440_1555528334648249_606500419603533634_n_1555528331314916.jpg', cap: 'Đàn em xinh đẹp' },
  { src: 'images/kiniem/129425417_372813044023460_7889730940976908420_n_372813037356794.jpg', cap: 'Một ngày ở trường' },
  { src: 'images/kiniem/129475308_712165619432069_9016322058950312623_n_712165616098736.jpg', cap: 'Giờ ra chơi' },
  { src: 'images/kiniem/129479806_844145662804099_5430859029225693278_n_844145652804100.jpg', cap: 'Vui vẻ cùng nhau' },
  { src: 'images/kiniem/129512282_416469062701814_677167458287408029_n_416469059368481.jpg', cap: 'Ngày tháng tươi đẹp' },
  { src: 'images/kiniem/129515605_471637183800088_1317326977153922461_n_471637180466755.jpg', cap: 'Kỷ niệm đẹp' },
  { src: 'images/kiniem/129534495_402145481231624_552024718583752244_n_402145477898291.jpg', cap: 'Mái trường yêu dấu' },
  { src: 'images/kiniem/150403040_228344305665248_1743793071808382750_n_228344302331915.png', cap: 'Buổi học vui' },
  { src: 'images/kiniem/157964397_808593359732236_359929606348928696_n_808593356398903.jpg', cap: 'Tập thể đáng yêu' },
  { src: 'images/kiniem/158226168_739157566974118_4033234098087776556_n_739157563640785.jpg', cap: 'Niềm vui bé nhỏ' },
  { src: 'images/kiniem/158245322_1289726101396118_8197110797344933602_n_1289726094729452.jpg', cap: 'Nhớ mãi không quên' },
  { src: 'images/kiniem/158253608_2827898744142664_2531937055399668046_n_2827898737475998.jpg', cap: 'Khoảnh khắc vàng' },
  { src: 'images/kiniem/158291252_487219782287244_4567499732830934972_n_487219778953911.jpg', cap: 'Nụ cười tuổi trẻ' },
  { src: 'images/kiniem/158367510_144151044241143_6852356311348986322_n_144151040907810.jpg', cap: 'Ánh mắt trong sáng' },
  { src: 'images/kiniem/158488800_917456392359733_6177552043857395149_n_917456385693067.jpg', cap: 'Đẹp tựa giấc mơ' },
  { src: 'images/kiniem/158714580_288466139294597_376518904717997241_n_288466132627931.jpg', cap: 'Tình bạn tri kỷ' },
  { src: 'images/kiniem/158717443_499462954410529_6060028802595653542_n_499462951077196.jpg', cap: 'Chúng ta là một' },
  { src: 'images/kiniem/158852578_857642541818857_6245724763797247103_n_857642535152191.jpg', cap: 'Lớp học hạnh phúc' },
  { src: 'images/kiniem/161655179_943498192855423_1411989736428657652_n_943498189522090.jpg', cap: 'Ngôi trường xưa' },
  { src: 'images/kiniem/161705121_2180316805432938_1335796205846806855_n_2180316798766272.jpg', cap: 'Tuổi thanh xuân' },
  { src: 'images/kiniem/162981041_278657573728654_7718853107785477288_n_278657567061988.png', cap: 'Khoảnh khắc bình yên' },
  { src: 'images/kiniem/163044031_870739623486854_2973922720851595337_n_870739620153521.jpg', cap: 'Góc kỷ niệm' },
  { src: 'images/kiniem/163107794_211501847424606_1954493483608168662_n_211501844091273.jpg', cap: 'Đoàn kết K15A3' },
  { src: 'images/kiniem/164909220_1780980748746896_1647789138581484418_n_1780980745413563.jpg', cap: 'Hàng cây mái trường' },
  { src: 'images/kiniem/165155576_196419555264306_1523041971079676676_n_196419548597640.jpg', cap: 'Giờ phút sum vầy' },
  { src: 'images/kiniem/165161370_748688875843016_9217684738757627063_n_748688872509683.jpg', cap: 'Niềm vui tuổi trẻ' },
  { src: 'images/kiniem/165241266_546761633305785_7248751860080133107_n_546761626639119.jpg', cap: 'Nhớ thương một thuở' },
  { src: 'images/kiniem/165306649_205994937963086_3226137825126661813_n_205994931296420.jpg', cap: 'Tình thầy trò' },
  { src: 'images/kiniem/165321635_239203024562671_6151693163352611931_n_239203017896005.jpg', cap: 'Bên nhau mãi mãi' },
  { src: 'images/kiniem/165450355_174302991173816_1803448030550889802_n_174302987840483.jpg', cap: 'Mùa hè rực rỡ' },
  { src: 'images/kiniem/165795184_2572482979712408_900528463755741156_n_2572482976379075.jpg', cap: 'Khoảnh khắc đáng giá' },
  { src: 'images/kiniem/166228738_3761277057318666_8874172613648599664_n_877093089812149.jpg', cap: 'Ngày xưa ấy' },
  { src: 'images/kiniem/166954516_2774654592845333_5458698289535272281_n_1102932910173517.jpg', cap: 'Ký ức mãi xanh' },
  { src: 'images/kiniem/167134651_812807332655541_5003604168607966631_n_432286884534306.jpg', cap: 'Tình bạn đẹp nhất' },
  { src: 'images/kiniem/169137143_947580982674916_1974459350771572012_n_947580949341586.jpg', cap: 'Nơi ta thuộc về' },
  { src: 'images/kiniem/169157288_3569091223314996_5169710809135010036_n_3569091216648330.jpg', cap: 'Mãi nhớ K15A3' },
  { src: 'images/kiniem/169458774_1178238252689455_1913497496057645923_n_1178238249356122.jpg', cap: 'Đàn em Hương Sử mãi mãi' },
  { src: 'images/kiniem/169684803_3810795925636364_2097322817952233677_n_3810795918969698.jpg', cap: 'Kỷ niệm lớp K15A3' },
  { src: 'images/kiniem/169725084_4338525739525836_4781812411877309627_n_4338525736192503.png', cap: 'Đàn em Hương Sử' },
  { src: 'images/kiniem/170087902_279833026944299_5535236271663925545_n_279832956944306.jpg', cap: 'Những khoảnh khắc đáng nhớ' },
  { src: 'images/kiniem/170264212_772330473425788_1466867114095408724_n_161408425864980.jpg', cap: 'Cùng nhau học tập' },
  { src: 'images/kiniem/170472105_1881904111956983_2899522369657456564_n_169126035214430.jpg', cap: 'Tiết học thú vị' },
  { src: 'images/kiniem/171039411_466862221218901_8886768314378977151_n_466862214552235.jpg', cap: 'Tuổi học trò' },
  { src: 'images/kiniem/171707737_946079949551352_4441693240043206149_n_946079942884686.jpg', cap: 'Lớp K15A3' },
  { src: 'images/kiniem/199843334_312639490327190_6118519185216159994_n_1109880049754898.png', cap: 'Hoạt động ngoại khoá' },
  { src: 'images/kiniem/240393321_527805938560808_2173538095807648439_n_527805935227475.jpg', cap: 'Tình bạn mãi mãi' },
  { src: 'images/kiniem/240673086_286232606639911_1734100866333341953_n_286232599973245.png', cap: 'Niềm vui học đường' },
  { src: 'images/kiniem/240683072_451476699227842_7612109830855111830_n_451476695894509.png', cap: 'Cô Hương và lớp' },
  { src: 'images/kiniem/240687687_1633950460132300_6656360522650391632_n_1633950453465634.png', cap: 'Hành trình K15A3' },
  { src: 'images/kiniem/240700807_322428129667580_2689856040683731897_n_322428126334247.png', cap: 'Bạn bè thân thiết' },
  { src: 'images/kiniem/240706921_234812951863773_6247944033156163825_n_234812945197107.png', cap: 'Những nụ cười' },
  { src: 'images/kiniem/240713176_517681752866927_87381358676192360_n_517681749533594.png', cap: 'Ký ức học trò' },
  { src: 'images/kiniem/240717199_252094383428948_817241837008442154_n_252094376762282.png', cap: 'Tuổi hồng' },
  { src: 'images/kiniem/240726273_4355325831169229_7870682889042735956_n_4355325817835897.png', cap: 'K15A3 mãi mãi' },
  { src: 'images/kiniem/240728079_569373904095966_9091116804810822819_n_569373900762633.png', cap: 'Đàn em xinh đẹp' },
  { src: 'images/kiniem/240756195_900344707567181_1730642967531413429_n_900344697567182.png', cap: 'Một ngày ở trường' },
  { src: 'images/kiniem/240769533_877261456500467_6785926877014235907_n_877261446500468.png', cap: 'Giờ ra chơi' },
  { src: 'images/kiniem/240786875_389146086105021_1781935026041594831_n_389146082771688.png', cap: 'Vui vẻ cùng nhau' },
  { src: 'images/kiniem/240819576_829889664388423_2836221992713307996_n_829889657721757.png', cap: 'Ngày tháng tươi đẹp' },
  { src: 'images/kiniem/240825770_546906116360621_7991912782193974943_n_546906109693955.png', cap: 'Kỷ niệm đẹp' },
  { src: 'images/kiniem/240827154_543210953641767_1366859195255402040_n_1869817179890060.png', cap: 'Mái trường yêu dấu' },
  { src: 'images/kiniem/240829305_387863826155529_1394347334329061393_n_387863819488863.png', cap: 'Buổi học vui' },
  { src: 'images/kiniem/240829749_144207254545326_3341750476098382197_n_144207247878660.png', cap: 'Tập thể đáng yêu' },
  { src: 'images/kiniem/240830329_1199847210496221_1414719918468290908_n_1199847207162888.png', cap: 'Niềm vui bé nhỏ' },
  { src: 'images/kiniem/240858146_1151169802038714_6945390843094130887_n_1151169798705381.png', cap: 'Nhớ mãi không quên' },
  { src: 'images/kiniem/240861981_875376856684745_3018105290187106451_n_875376850018079.jpg', cap: 'Khoảnh khắc vàng' },
  { src: 'images/kiniem/240866397_396726875302994_179744103360191203_n_396726871969661.jpg', cap: 'Nụ cười tuổi trẻ' },
  { src: 'images/kiniem/240868515_1009602556544263_3840055710555372021_n_1009602549877597.jpg', cap: 'Ánh mắt trong sáng' },
  { src: 'images/kiniem/240868540_4895301550486171_8885824486673190657_n_4895301547152838.jpg', cap: 'Đẹp tựa giấc mơ' },
  { src: 'images/kiniem/240901455_529530984997626_8089326812889329447_n_529530981664293.jpg', cap: 'Tình bạn tri kỷ' },
  { src: 'images/kiniem/240903065_830230251017253_1271910094643582635_n_830230244350587.jpg', cap: 'Chúng ta là một' },
  { src: 'images/kiniem/240914873_176990254557907_5285070744460390287_n_176990251224574.jpg', cap: 'Lớp học hạnh phúc' },
  { src: 'images/kiniem/241017096_217976140370401_6141608433486545272_n_217976133703735.jpg', cap: 'Ngôi trường xưa' },
  { src: 'images/kiniem/241410071_573943433784769_8133210329240157878_n_573943427118103.jpg', cap: 'Tuổi thanh xuân' },
  { src: 'images/kiniem/241443792_558688195452646_2292007366619162752_n_558688192119313.png', cap: 'Khoảnh khắc bình yên' },
  { src: 'images/kiniem/241497745_4566540583405618_8024347963686078209_n_4566540573405619.jpg', cap: 'Góc kỷ niệm' },
  { src: 'images/kiniem/244942003_908647289772900_3924500665737655685_n_908647286439567.jpg', cap: 'Đoàn kết K15A3' },
  { src: 'images/kiniem/245049220_219339213478853_548207488505077949_n_219339210145520.jpg', cap: 'Hàng cây mái trường' },
  { src: 'images/kiniem/245094798_3015915018724929_187975325853687289_n_3015915015391596.jpg', cap: 'Giờ phút sum vầy' },
  { src: 'images/kiniem/245095420_856636051716401_8177144042878905270_n_856636045049735.jpg', cap: 'Niềm vui tuổi trẻ' },
  { src: 'images/kiniem/245183325_3054770154792123_7578128619739938313_n_3054770151458790.jpg', cap: 'Nhớ thương một thuở' },
  { src: 'images/kiniem/245497739_600095594742992_7007436661946840455_n_600095591409659.jpg', cap: 'Tình thầy trò' },
  { src: 'images/kiniem/246302000_1001503020426698_8215918691232176677_n_1001503017093365.jpg', cap: 'Bên nhau mãi mãi' },
  { src: 'images/kiniem/246407311_938046930125866_6578090784087320916_n_938046923459200.jpg', cap: 'Mùa hè rực rỡ' },
  { src: 'images/kiniem/246417985_668540534115281_4783885169725081641_n_668540530781948.jpg', cap: 'Khoảnh khắc đáng giá' },
  { src: 'images/kiniem/246447516_255627773041654_1573876285231408514_n_255627766374988.jpg', cap: 'Ngày xưa ấy' },
  { src: 'images/kiniem/246454894_1062056864541750_5048667376704962927_n_1062056861208417.jpg', cap: 'Ký ức mãi xanh' },
  { src: 'images/kiniem/246564347_1249897168768953_2462170853165431072_n_1249897165435620.jpg', cap: 'Tình bạn đẹp nhất' },
  { src: 'images/kiniem/272950853_385248840029619_7681029425492199856_n_385248833362953.jpg', cap: 'Nơi ta thuộc về' },
  { src: 'images/kiniem/274030886_487101996218992_1504499164917453507_n_378366297623728.jpg', cap: 'Mãi nhớ K15A3' },
];

// Photos for intro page showcase & grid
const INTRO_SHOWCASE_PHOTOS = [
  'photos k15a3/129329734_1598234070370879_5353165190072347495_n_1598234067037546.jpg',
  'photos k15a3/164688101_487389305953415_5125096991014904338_n_487389295953416.jpg',
  'photos k15a3/126180976_225033519008572_1539079022890582179_n_225033479008576.jpg',
  'photos k15a3/162577722_454643989139159_2193275829941297808_n_454643529139205.jpg',
  'photos k15a3/165011621_828423341081608_5367045768498855560_n_828423331081609.jpg',
  'photos k15a3/240558210_545965189963398_99957858799934874_n_545965186630065.jpg',
  'photos k15a3/127212818_2747393345579083_1651978878349848858_n_2747393305579087.jpg',
  'photos k15a3/164822414_225581092645887_8543665876259678136_n_225581089312554.jpg',
  'photos k15a3/244833944_575437860463266_7812930975913091835_n_575437853796600.jpg',
  'photos k15a3/245203635_592757902072418_8370894688247459196_n_592757898739085.jpg',
  'photos k15a3/172122000_787848795426728_3135930218174165811_n_787848792093395.jpg',
  'photos k15a3/380831576_1532161237536236_6319545112640851979_n_1532161234202903.jpg',
  'photos k15a3/163845839_723935598315229_1875661971629330618_n_723935578315231.jpg',
  'photos k15a3/277187694_483202366806355_5683004679820578885_n_483202360139689.jpg',
  'photos k15a3/157928423_925646051533589_1690483375901021937_n_925646048200256.jpg',
  'photos k15a3/100932229_649331615646045_364491184099295232_n_649331358979404.jpg',
];

const INTRO_GRID_PHOTOS = [
  'photos k15a3/106023055_293668088345105_2610050223471932116_n_271527414067133.jpg',
  'photos k15a3/164813858_870674723477938_7521510081963658838_n_870674713477939.jpg',
  'photos k15a3/129250753_734810620749484_3790856358448483577_n_734810617416151.jpg',
  'photos k15a3/165068900_1337225293329248_3611684000527959209_n_1337225289995915.jpg',
  'photos k15a3/246966171_1780539795465665_7898113382941932252_n_1780539792132332.jpg',
  'photos k15a3/164942042_241923907614586_2419176613519525627_n_241923897614587.jpg',
  'photos k15a3/151202823_3470215093086769_2233028101297958351_n_3470214999753445.jpg',
  'photos k15a3/276968061_685591542789847_804297813556015062_n_685591539456514.jpg',
];

// ============================================
// HERO PHOTO ORBIT (floating photos in header)
// ============================================
function initHeroOrbit() {
  const wrap = document.getElementById('heroOrbit');
  if (!wrap) return;
  const photos = INTRO_SHOWCASE_PHOTOS.slice(0, 8);
  const positions = [
    { top: '8%',  left: '3%',  w: 80, h: 60 },
    { top: '15%', right: '4%', w: 90, h: 65 },
    { top: '55%', left: '2%',  w: 75, h: 55 },
    { top: '60%', right: '3%', w: 85, h: 60 },
    { top: '30%', left: '8%',  w: 70, h: 50 },
    { top: '35%', right: '8%', w: 75, h: 55 },
    { top: '80%', left: '6%',  w: 65, h: 50 },
    { top: '78%', right: '6%', w: 70, h: 52 },
  ];
  photos.forEach((src, i) => {
    const pos = positions[i];
    const div = document.createElement('div');
    div.className = 'orbit-photo';
    div.style.cssText = `
      width:${pos.w}px; height:${pos.h}px;
      top:${pos.top}; ${pos.left ? 'left:'+pos.left : 'right:'+pos.right};
      animation-duration:${6 + Math.random()*6}s;
      animation-delay:${Math.random()*3}s;
    `;
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'K15A3';
    img.loading = 'lazy';
    img.onload = () => div.classList.add('loaded');
    img.onerror = () => div.style.display = 'none';
    div.appendChild(img);
    wrap.appendChild(div);
  });
}

// ============================================
// INTRO SHOWCASE BANNER (scrolling photos)
// ============================================
function initIntroShowcase() {
  const track = document.getElementById('showcaseTrack');
  if (!track) return;
  const photos = INTRO_SHOWCASE_PHOTOS;
  // Duplicate for infinite scroll
  [...photos, ...photos].forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'K15A3 kỷ niệm';
    img.loading = 'lazy';
    img.onerror = () => img.style.display = 'none';
    track.appendChild(img);
  });
}

// ============================================
// INTRO PHOTO GRID
// ============================================
function initIntroPhotoGrid() {
  const grid = document.getElementById('introPhotoGrid');
  if (!grid) return;
  INTRO_GRID_PHOTOS.forEach((src, i) => {
    const div = document.createElement('div');
    div.className = 'grid-photo fade-in-up';
    div.innerHTML = `<img src="${src}" alt="K15A3 kỷ niệm" loading="lazy"
      onerror="this.parentElement.style.display='none'">`;
    div.addEventListener('click', () => {
      // Open lightbox-style view
      const idx = GALLERY_PHOTOS.findIndex(p => p.src === src);
      if (idx >= 0) { switchTab('gallery'); setTimeout(() => openLightbox(idx), 400); }
    });
    grid.appendChild(div);
  });
}

// ============================================
// PARTICLES CANVAS
// ============================================
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;
  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    placeParticles();
  });

  const particles = [];
  const count = 60;
  const symbols = ['✿', '❀', '✦', '★', '✧', '❋', '◆', '⋆', '❁', '✺'];

  function placeParticles() {
    particles.length = 0;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 14 + 8,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        speedY: -(Math.random() * 0.5 + 0.2),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.6 + 0.1,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.6
          ? `rgba(212,175,55,${Math.random() * 0.5 + 0.1})`
          : `rgba(128,0,0,${Math.random() * 0.3 + 0.05})`,
      });
    }
  }

  placeParticles();

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.drift += p.driftSpeed;
      p.x += p.speedX + Math.sin(p.drift) * 0.4;
      p.y += p.speedY;
      if (p.y < -30) { p.y = H + 30; p.x = Math.random() * W; }
      if (p.x < -30) p.x = W + 30;
      if (p.x > W + 30) p.x = -30;
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.font = `${p.size}px Arial`;
      ctx.fillText(p.symbol, p.x, p.y);
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }

  draw();
}

// ============================================
// FLOATING BUBBLES (header bg)
// ============================================
function initHeaderBubbles() {
  const wrap = document.querySelector('.header-bg-anim');
  if (!wrap) return;
  for (let i = 0; i < 18; i++) {
    const span = document.createElement('span');
    const size = Math.random() * 80 + 20;
    span.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;
      bottom:${-size}px;
      animation-duration:${Math.random()*12+8}s;
      animation-delay:${Math.random()*8}s;
      border-radius:${Math.random()>0.5?'50%':'30% 70% 70% 30% / 30% 30% 70% 70%'};
    `;
    wrap.appendChild(span);
  }
}

// ============================================
// DONATION PAGE
// ============================================
let donationInited = false;

function initDonation() {
  if (donationInited) return;
  donationInited = true;

  let totalAll = 0;
  let donorCount = 0;
  const genderTotals = { female: 0, male: 0 };
  const genderDonors = { female: 0, male: 0 };

  ['female', 'male'].forEach(gender => {
    const listEl = document.getElementById(`don-list-${gender}`);
    if (!listEl) return;
    const sorted = [...MEMBERS[gender]].sort((a, b) => b.donation - a.donation);
    listEl.innerHTML = '';
    let genderTotal = 0;
    let genderDonorCount = 0;
    sorted.forEach((m, idx) => {
      totalAll += m.donation;
      genderTotal += m.donation;
      if (m.donation > 0) { donorCount++; genderDonorCount++; }
      const rankClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : 'rank-n';
      const rankLabel = idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : (idx + 1);
      const amtStr    = m.donation > 0 ? m.donation.toLocaleString('vi-VN') + 'đ' : '—';
      const amtClass  = m.donation > 0 ? 'amount-text' : 'amount-text zero-val';
      const opacity   = m.donation > 0 ? '1' : '0.5';
      listEl.innerHTML += `
        <div class="member-item" style="opacity:${opacity}">
          <div class="member-rank ${rankClass}">${rankLabel}</div>
          <span class="member-name">${m.name}</span>
          <span class="${amtClass}">${amtStr}</span>
        </div>
      `;
    });
    genderTotals[gender] = genderTotal;
    genderDonors[gender] = genderDonorCount;

    // Column footer with subtotal
    const footerEl = document.getElementById(`col-footer-${gender}`);
    if (footerEl) {
      footerEl.innerHTML = `
        <div class="col-footer-inner">
          <span class="col-footer-label">Tổng cộng (${genderDonorCount}/${sorted.length} người)</span>
          <span class="col-footer-amount">${genderTotal.toLocaleString('vi-VN')}đ</span>
        </div>
      `;
    }
  });

  animateTotal(totalAll);
  animateProgressBar(totalAll);

  // Update summary stats
  const avgDonation = donorCount > 0 ? Math.round(totalAll / donorCount) : 0;
  animateStat('donor-count', donorCount, false);
  animateStat('female-total', genderTotals.female, true);
  animateStat('male-total', genderTotals.male, true);
  animateStat('avg-donation', avgDonation, true);
}

function animateStat(elId, target, isCurrency) {
  const el = document.getElementById(elId);
  if (!el) return;
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = isCurrency ? current.toLocaleString('vi-VN') + 'đ' : current;
    if (current >= target) clearInterval(timer);
  }, 30);
}

function animateTotal(target) {
  let current = 0;
  const step = Math.ceil(target / 50);
  const el = document.getElementById('grand-total');
  if (!el) return;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString('vi-VN') + 'đ';
    if (current >= target) clearInterval(timer);
  }, 30);
}

function animateProgressBar(total) {
  const goal = 5000000;
  const pct = Math.min((total / goal) * 100, 100).toFixed(1);
  setTimeout(() => {
    const bar = document.querySelector('.progress-bar-fill');
    const lbl = document.querySelector('.progress-pct');
    if (bar) bar.style.width = pct + '%';
    if (lbl) lbl.textContent = pct + '%';
  }, 300);
  const goalEl = document.querySelector('.progress-goal');
  if (goalEl) goalEl.textContent = `Mục tiêu: ${(15000000).toLocaleString('vi-VN')}đ`;
}

// ============================================
// GALLERY / LIGHTBOX
// ============================================
let galleryInited = false;
let currentPhotoIdx = 0;

function initGallery() {
  if (galleryInited) return;
  galleryInited = true;

  const grid = document.querySelector('.masonry-gallery');
  if (!grid) return;

  GALLERY_PHOTOS.forEach((photo, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item fade-in-up';
    item.dataset.index = i;
    item.innerHTML = `
      <img src="${photo.src}" alt="${photo.cap}" loading="lazy"
           onerror="this.parentElement.style.display='none'">
      <div class="gallery-overlay">
        <span class="gallery-overlay-text">🔍 ${photo.cap}</span>
      </div>
    `;
    item.addEventListener('click', () => openLightbox(i));
    grid.appendChild(item);
  });

  setTimeout(() => {
    document.querySelectorAll('.gallery-item.fade-in-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 60);
    });
  }, 100);
}

function openLightbox(idx) {
  currentPhotoIdx = idx;
  const lb = document.getElementById('lightbox');
  lb.classList.add('open');
  updateLightboxPhoto();
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxNext() {
  currentPhotoIdx = (currentPhotoIdx + 1) % GALLERY_PHOTOS.length;
  updateLightboxPhoto();
}

function lightboxPrev() {
  currentPhotoIdx = (currentPhotoIdx - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length;
  updateLightboxPhoto();
}

function updateLightboxPhoto() {
  const photo = GALLERY_PHOTOS[currentPhotoIdx];
  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-cap');
  const counter = document.getElementById('lb-counter');
  if (img) { img.src = photo.src; img.alt = photo.cap; }
  if (cap) cap.textContent = photo.cap;
  if (counter) counter.textContent = `${currentPhotoIdx + 1} / ${GALLERY_PHOTOS.length}`;
}

document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (lb && lb.classList.contains('open')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lightboxNext();
    if (e.key === 'ArrowLeft') lightboxPrev();
  }
});

// ============================================
// MEMBERS PAGE
// ============================================
let membersInited = false;
let currentGenderFilter = 'all';

function initMembers() {
  if (membersInited) return;
  membersInited = true;
  renderMembers('all', '');
}

function renderMembers(genderFilter, searchText) {
  const grid = document.querySelector('.members-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const allMembers = [
    ...MEMBERS.female.map(m => ({
      ...m, gender: 'female',
      photo: MEMBER_PHOTO_MAP[m.name] || DEFAULT_MEMBER_PHOTO.female,
      social: MEMBER_SOCIAL_MAP[m.name] || { fb: '', zalo: '' },
    })),
    ...MEMBERS.male.map(m => ({
      ...m, gender: 'male',
      photo: MEMBER_PHOTO_MAP[m.name] || DEFAULT_MEMBER_PHOTO.male,
      social: MEMBER_SOCIAL_MAP[m.name] || { fb: '', zalo: '' },
    })),
  ];

  const filtered = allMembers.filter(m => {
    const matchGender = genderFilter === 'all' || m.gender === genderFilter;
    const matchSearch = m.name.toLowerCase().includes(searchText.toLowerCase());
    return matchGender && matchSearch;
  });

  filtered.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = 'member-card';
    const genderLabel = m.gender === 'female' ? '🌺 Nữ' : '🛡️ Nam';
    const badgeClass  = m.gender === 'female' ? 'badge-female' : 'badge-male';
  
    const donColor    = m.donation > 0 ? '#27ae60' : '#b2bec3';
    const icon        = m.gender === 'female' ? '🌸' : '⚽';

    // Build social links HTML
    const hasFb = m.social.fb && m.social.fb.trim() !== '';
    const hasZalo = m.social.zalo && m.social.zalo.trim() !== '';
    const hasSocial = hasFb || hasZalo;

    const socialFrontHtml = hasSocial ? `
      <div class="member-social-front">
        ${hasFb ? `<a href="${m.social.fb}" target="_blank" rel="noopener" class="social-link-mini social-fb" title="Facebook" onclick="event.stopPropagation()">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>` : ''}
        ${hasZalo ? `<a href="${m.social.zalo}" target="_blank" rel="noopener" class="social-link-mini social-zalo" title="Zalo" onclick="event.stopPropagation()">
          <svg viewBox="0 0 48 48" width="16" height="16" fill="currentColor"><path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm-3.2 29.6c-1.2 0-2.133-.267-2.933-.667l-3.267 1.067.933-2.933c-.533-.867-.933-1.933-.933-3.067 0-3.467 2.8-6.267 6.267-6.267s6.267 2.8 6.267 6.267-2.867 6.6-6.333 6.6zm10.4-7.867c0-1.933-1.067-3.6-2.667-4.467 1.133-1.267 1.867-2.933 1.867-4.8 0-3.933-3.2-7.133-7.133-7.133A7.13 7.13 0 0016.133 16.467c0 1.867.733 3.533 1.867 4.8-1.6.867-2.667 2.533-2.667 4.467 0 2.8 2.267 5.067 5.067 5.067.8 0 1.533-.2 2.2-.533.667.333 1.4.533 2.2.533 2.8 0 5.067-2.267 5.067-5.067h1.333z"/></svg>
        </a>` : ''}
      </div>
    ` : '';

    const socialBackHtml = hasSocial ? `
      <div class="member-social-back">
        ${hasFb ? `<a href="${m.social.fb}" target="_blank" rel="noopener" class="social-btn social-btn-fb" onclick="event.stopPropagation()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </a>` : ''}
        ${hasZalo ? `<a href="${m.social.zalo}" target="_blank" rel="noopener" class="social-btn social-btn-zalo" onclick="event.stopPropagation()">
          <svg viewBox="0 0 48 48" width="14" height="14" fill="currentColor"><path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm-3.2 29.6c-1.2 0-2.133-.267-2.933-.667l-3.267 1.067.933-2.933c-.533-.867-.933-1.933-.933-3.067 0-3.467 2.8-6.267 6.267-6.267s6.267 2.8 6.267 6.267-2.867 6.6-6.333 6.6zm10.4-7.867c0-1.933-1.067-3.6-2.667-4.467 1.133-1.267 1.867-2.933 1.867-4.8 0-3.933-3.2-7.133-7.133-7.133A7.13 7.13 0 0016.133 16.467c0 1.867.733 3.533 1.867 4.8-1.6.867-2.667 2.533-2.667 4.467 0 2.8 2.267 5.067 5.067 5.067.8 0 1.533-.2 2.2-.533.667.333 1.4.533 2.2.533 2.8 0 5.067-2.267 5.067-5.067h1.333z"/></svg>
          Zalo
        </a>` : ''}
      </div>
    ` : '<div class="member-social-back no-social"><span class="no-social-text">Chưa cập nhật liên kết</span></div>';

    card.innerHTML = `
      <div class="member-card-inner">
        <div class="card-front ${m.gender}">
          <div class="member-photo-wrap">
            <img src="${m.photo}" alt="${m.name}" loading="lazy"
                 onerror="this.parentElement.innerHTML='<div class=&quot;member-avatar-placeholder&quot;>${icon}</div>'">
          </div>
          <div class="member-full-name">${m.name}</div>
          <span class="member-gender-badge ${badgeClass}">${genderLabel}</span>
          ${socialFrontHtml}
        </div>
        <div class="card-back ${m.gender}">
          <div class="back-icon">${icon}</div>
          <div class="back-name">${m.name}</div>
          <div class="back-divider"></div>
          <div class="back-label">GIỚI TÍNH</div>
          <div class="back-val">${genderLabel}</div>
          ${socialBackHtml}
        </div>
      </div>
    `;

    card.addEventListener('click', () => card.classList.toggle('flipped'));
    grid.appendChild(card);
  });

  setTimeout(() => {
    grid.querySelectorAll('.member-card').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 50);
    });
  }, 50);
}

function filterGender(gender) {
  currentGenderFilter = gender;
  document.querySelectorAll('.g-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.g-btn[data-gender="${gender}"]`).classList.add('active');
  const search = document.querySelector('.members-search-wrap input')?.value || '';
  renderMembers(gender, search);
}

function searchMembers(val) {
  renderMembers(currentGenderFilter, val);
}

// ============================================
// INTERSECTION OBSERVER
// ============================================
let ioInited = false;
function initIntersectionObserver() {
  if (ioInited) return;
  ioInited = true;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in-up').forEach(el => io.observe(el));
}

// Animated counters
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

function scrollToContent() {
  document.querySelector('.nav-sticky').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initHeaderBubbles();
  initHeroOrbit();
  initIntroShowcase();
  initIntroPhotoGrid();
  switchTab('intro');
  setTimeout(animateCounters, 600);

  const io2 = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in-up').forEach(el => io2.observe(el));
});
