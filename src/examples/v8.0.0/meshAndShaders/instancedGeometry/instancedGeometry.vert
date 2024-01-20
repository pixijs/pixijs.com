precision mediump float;
attribute vec2 aVPos;
attribute vec2 aIPos;
attribute vec3 aICol;

uniform mat3 translationMatrix;
uniform mat3 projectionMatrix;

varying vec3 vCol;

void main() {
    vCol = aICol;

    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVPos + aIPos, 1.0)).xy, 0.0, 1.0);
}