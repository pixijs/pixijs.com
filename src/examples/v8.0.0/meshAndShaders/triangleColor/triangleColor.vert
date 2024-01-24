in vec2 aPosition;
in vec3 aColor;

out vec3 vColor;
uniform mat3 projectionMatrix;
uniform mat3 worldTransformMatrix;

uniform mat3 uTransformMatrix;


void main() {

    mat3 mvp = projectionMatrix * worldTransformMatrix * uTransformMatrix;
    gl_Position = vec4((mvp * vec3(aPosition, 1.0)).xy, 0.0, 1.0);

    vColor = aColor;
}