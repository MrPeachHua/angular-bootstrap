(function($,doc,win){
    //�ж��ֻ�������״̬��
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
        if (window.orientation === 180 || window.orientation === 0) {
            alert('����״̬��');
        }
        if (window.orientation === 90 || window.orientation === -90 ){
            alert('����״̬��');
        }
    }, false);
//�ƶ��˵������һ�㶼֧��window.orientation���������ͨ��������������жϳ��ֻ��Ǵ��ں�����������״̬��
})(jQuery,document,window)