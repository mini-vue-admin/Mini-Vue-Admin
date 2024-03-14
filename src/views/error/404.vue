<template>
  <main>
    <h1>404 :(</h1>
    <p>嗨，朋友！看上去你输入的地址不存在哦~</p>
    <RouterLink to="/" class="btn">返回首页</RouterLink>
  </main>
</template>

<style scoped>

a {
  color: #3498db;
  text-decoration: none;
}

h1 {
  margin-top: 0;
  font-size: 3.5em;
}

main {
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.btn {
  color: #fff;
  padding: .35em 1em;
  background: #3498db;
  border-radius: 1.5em;
  display: inline-block;
  transition: opacity .3s, transform .3s;
}

.btn:hover {
  transform: scale(1.1);
}

.btn:active {
  opacity: .7;
}
</style>