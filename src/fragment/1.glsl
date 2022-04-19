#ifdef GL_ES
    precision mediump float;
    #endif
    
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_low;
    
    vec2 uvN(){
        vec2 pos = gl_FragCoord.xy/u_resolution;
        pos.x *= u_resolution.x/u_resolution.y;
        pos = pos *2.-1.;
        return pos;
    }
    
    void main() {
        vec2 pos = uvN();
    
        float dx = distance(pos.x,0.5); 
        float dy = distance(pos.y,0.);
        
        vec3 color;
        color = vec3(dx/cos(pos.y)/sin(u_time)+0.5,0.,dy/cos(pos.y)/cos(u_time));
    
        gl_FragColor = vec4(color,1.0);
    }