window.addEventListener('load', () => {
    const canvas = document.querySelector("#canvas");
    const context = canvas.getContext('2d');
    
    set_to_zero();

    context.lineWith = 10;
    context.lineCap = 'round';

    let isDrawing = false;
    let x = 0;
    let y = 0;

    canvas.addEventListener('mousedown', e => {
        x = e.offsetX/10;
        y = e.offsetY/10;
        isDrawing = true;
    });
    
    canvas.addEventListener('mousemove', e => {
        if (isDrawing === true) {
            drawLine(context, x, y, e.offsetX/10, e.offsetY/10);
            x = e.offsetX/10;
            y = e.offsetY/10;
        }
    });
    
    window.addEventListener('mouseup', e => {
        if (isDrawing === true) {
            drawLine(context, x, y, e.offsetX/10, e.offsetY/10);
            x = 0;
            y = 0;
            isDrawing = false;
            send_image();
        }
    });
    
    function drawLine(context, x1, y1, x2, y2) {
        context.beginPath();
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.closePath();
    }

    
    document.getElementById("clear").addEventListener("click", function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        set_to_zero();
    });

    function set_to_zero(){
        for (i = 0; i < 10; i++) {
            var i;
            document.getElementById("bar" + String(i)).innerHTML = '0%';
            document.getElementById("bar" + String(i)).style.width = '0%';
        }
    }

    function send_image(){
        let myImageData = context.getImageData(0, 0, 28, 28);
        let counter_slow = 0;
        let counter_fast = 3;
        let image = {};
        image['data'] = {}
        let size_image = Object.keys(myImageData['data']).length;
        let is_empty = true;

        while (counter_fast < size_image){
            image['data'][counter_slow] = myImageData['data'][counter_fast];
            counter_fast = counter_fast + 4;
            counter_slow = counter_slow + 1;
            if (image['data'][counter_slow] != 0){
                is_empty = false;
            }
        }

        var data = {
            image: image,
            image_name : "test"
          }
        
        if (!is_empty){
            submit(JSON.stringify(data));
        }
    };

    function submit(json_file) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) { 
                    let result = JSON.parse(xhr.response);
                    output_list = result['response']['result']

                    var i;
                    for (i = 0; i < 10; i++) {
                        document.getElementById("bar" + String(i)).innerHTML = String(Math.round(output_list[i]*100)) + '%';
                        document.getElementById("bar" + String(i)).style.width = String(Math.round(output_list[i]*100)) + '%';
                    }
                } 
                else {}
            }
        }

        xhr.open("POST", 'https://kvvxdzouqk.execute-api.us-east-2.amazonaws.com/Production/testing', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(json_file);
    }

});

