-- Test Shader

INSERT INTO shader (id, title, shader_code, author_id, created_at, preview_img)
VALUES (
    uuid_generate_v4(),
    'Raymarching Sphere',
    '
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .01

float GetDist(vec3 p) {
    vec4 s = vec4(0, 1, 6, 1);

    float sphereDist =  length(p-s.xyz)-s.w;
    float planeDist = p.y;

    float d = min(sphereDist, planeDist);
    return d;
}

float RayMarch(vec3 ro, vec3 rd) {
    float dO=0.;

    for(int i=0; i<MAX_STEPS; i++) {
        vec3 p = ro + rd*dO;
        float dS = GetDist(p);
        dO += dS;
        if(dO>MAX_DIST || dS<SURF_DIST) break;
    }

    return dO;
}

vec3 GetNormal(vec3 p) {
    float d = GetDist(p);
    vec2 e = vec2(.01, 0);

    vec3 n = d - vec3(
        GetDist(p-e.xyy),
        GetDist(p-e.yxy),
        GetDist(p-e.yyx));

    return normalize(n);
}

float GetLight(vec3 p) {
    vec3 lightPos = vec3(0, 5, 6);
    lightPos.xz += vec2(sin(TIME), cos(TIME))*2.;
    vec3 l = normalize(lightPos-p);
    vec3 n = GetNormal(p);

    float dif = clamp(dot(n, l), 0., 1.);
    float d = RayMarch(p+n*SURF_DIST*2., l);
    if(d<length(lightPos-p)) dif *= .1;

    return dif;
}

void main()
{
    vec2 uv = (gl_FragCoord.xy-.5*RESOLUTION.xy)/RESOLUTION.y;

    vec3 col = vec3(0);

    vec3 ro = vec3(0, 1, 0);
    vec3 rd = normalize(vec3(uv.x, uv.y, 1));

    float d = RayMarch(ro, rd);

    vec3 p = ro + rd * d;

    float dif = GetLight(p);
    col = vec3(dif);

    col = pow(col, vec3(.4545));	// gamma correction

    gl_FragColor = vec4(col,1.0);
}',
    'f6acdbc8-f257-4ad0-b343-39d5dbe9755a',
    now(),
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAFAAoADAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8qqACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA9p+F/7H3x2+KtrZ6xpnhaPRdEvsmLVtcnFpAU8kSpIseDPJG4ZAkkcToS3XAYqAfSHgz/gm54EsTFcfEz4talqHmWS+bZaDZx2nkXZ2lttxN5vmxL+8UZhjZsq3y4KkA9G8J/sQ/sn+GPtY1jRNd8WfafL8r+2NZkj+y7d2fL+xC3zu3DO/f8AcXbt+bIAeLP2If2TvE/2QaPomu+E/s3meb/Y+sySfat23HmfbRcY27TjZs++27d8uADznxn/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d1AC7vegBd1ABuoAXd70ALv96ADdQAu6gBd/vQAb/egBd/0oAN/pQAu+gA30ALv96ADfQAbvpQAu/wB/1oAN/v8ArQAb6AF3/WgA30AG+gA30AG+gA30AG+gA30AG+gA30AG+gA3/WgBN9ABv9/1oAN/v+tACbvpQAb6ADf70AJvoAN9ACb/AFoAN/0oATf70AG/3oATdQAm6gA3+9ACbvegBN1AAWoATd70AJuoATdQAhb3oATcKAE3UAIT6mgBNwoAMmgBpPqaAE3elACEk0AJkUAISaAEoAQt6UANyDQAtAC7qAFyKAFyaAF3UAGRQAoPoaAF3UALuFACg+hoAXcaADd7UALuHrQAu73oANxoAXdQAbqAF3e9AC7jQAbvagBd1ABu96AF3+9ABu+lAC7qADd7UALu+tABu+tABv8AegA3+9AC7/egA3fSgA3fSgA3fSgA3igA3CgBd3tQAbvagA3e1ABu9qADd7UAG72oATcKADeKADd9KADd9KADd9KADf70AJv96ADf70AG760AG760AJu9qADdQAm76UAG/wB6AE3e9ABuoATd7UAG40AJu96AE3UAG6gBNxoAN3vQAm4etACbvagA3GgBCfU0AJuFACbqAEJ9TQAmRQAbqAEyaAEyKAE3UAJQAmQKAG0AKCRQAu6gAyKAFyaAF3UAG4UALn0NAC5NAC7qADcKAFz6GgBcmgA3UALuFABketAC7vegBdxoAN1ABuoAXcKADd70ALu96ADdQAu72oAN3tQAbqADd9aAF3e9ABu96ADd70AG73oAXd9KADd9KADd9KADd7UAG72oAN3tQAbvagA3e1ABu9qADd7UAG72oAN3tQAbvagA3fSgA3fSgA3fSgBN3vQAbvegA3e9ABu96AE3fWgA3UAG72oAN3tQAm6gA3e9ACbvegA3CgBN1ABuoANxoATd70AJketABuFACbqADJoAQn1NACbhQAbqAEyaAEz6mgBNwoAN1ACZNACZFABuoAQkmgBKAG5IoAXdQAZFAC0AGTQAu72oAXcKADNAC5PrQAu40AG6gBcigAz6GgBcn1oANxoAXd7UAG4UAGRQAufegBcmgA3GgA3e1ABu9qAF3CgAyPWgA3e9AC7vegA3e9ABk0ALuNABuNABu9qADd7UAG72oAN1ABuFABuFABuFABuFABuFABuFABuFABuFABuFABuFABuoAN3tQAbvagA3e1ABuNABuNACZNABu96ADd70AJu96ADI9aADcKAE3e1ABu9qADcaADJoATPvQAmRQAbhQAbvagBNxoAMn1oATPqaADIoATdQAbjQAmT60AJmgA3CgBN3tQAmTQAUAJkUAG6gBMk0AN3UALkUAFABQAuTQAu6gAyKAFoAMn1oAXJoAN3tQAu4UAGR60ALn0NABk+tAC7jQAbvagA3CgA3CgBcj1oAM+9AC5PrQAZNABuNAC7qADd7UAG4UAG4UAG4UAGRQAu73oAN3vQAbvegA3e9ABn3oAXJoAMmgAyaADJoAMmgAyaADJoAMmgAyaADJoATPvQAbvegA3e9ABu96ADd70AJkUAG4UAG4UAG4UAG72oAN1ACbjQAZNABk+tACZ96ADI9aAE3CgA3CgA3e1ABuNACZPrQAZ9TQAmR60AG4UAJu9qADJoATJ9aACgBMigA3UAJk0AJQAUAGRQAm6gBKACgAoAMmgBd1AC5FABQAUALk+tABuNAC7vagA3CgBcj1oAKADJ9aAFyaADcaADd7UALuFABkUAGRQAZHrQAufegAyfWgAyaADJoAXcaADdQAbvagA3e1ABuFABuFABuFAC5FABkUAGRQAZFABkUAGRQAZFABkUAGRQAZFABkUAGRQAZFABkUAJuFABuFABuFABu9qADd7UAG6gA3GgBMmgAyaADJ9aADPvQAmR60AGRQAZFABuFACbvagA3GgAyaAEyfWgAoAMj1oATcKADd7UAJuNABk+tACUAFABkUAJuoATJoAKACgAoAZQAuTQAbvagBcigBaACgAoAMn1oAXcaADd7UAG4UALketABQAUALk0AGTQAbjQAu6gA3UAG4UAGR60ALketABQAUAGT60ALk+tABk0AG40AG40AG40AG6gA3e1ABu9qADd7UALuFABuFABuFABuFABuFABuFABuFABuFABuFABuFABuFABuFACbvagA3e1ABu9qADdQAbjQAbjQAbjQAZNABk+tACZPrQAUAFABketACZHrQAbhQAbqADdQAm40AGTQAZNACUAFABketACbhQAbvagA3GgBMn1oAKACgAoATIoATd7UAGTQAlACbqAFyPWgAoAKACgBcn1oANxoAN3tQAuRQAZFAC0AFABQAZPrQAZPrQAu40AG72oANwoAXIoAMigAyPWgAoAKACgBaADJ9aADJoAMmgA3GgA3GgBd3tQAbvagA3e1ABuoANwoANwoANwoANwoANwoANwoANwoANwoANwoANwoANwoANwoAN1ABu9qADd7UAG72oATcaADcaADJoAMmgAyfWgAoASgAoAKADI9aADIoAMigBNwoAN3tQAbjQAmT60AGT60AFABQAUAJkUAGRQAm72oANxoAMn1oASgAoAKADI9aAE3UAf/2Q=='
);