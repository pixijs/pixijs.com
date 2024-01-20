precision mediump float;

attribute vec2 aPosition;
attribute vec2 aUV;

uniform mat3 projectionMatrix;
uniform mat3 worldTransformMatrix;

uniform mat3 uTransformMatrix;


varying vec2 vUvs;

void main() {

    vUvs = aUV;
    mat3 mvp = projectionMatrix * worldTransformMatrix * uTransformMatrix;
    gl_Position = vec4((mvp * vec3(aPosition, 1.0)).xy, 0.0, 1.0);

}