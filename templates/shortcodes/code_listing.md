{%- if use_listing -%}
{%- set data = load_data(path="static" ~ path ~ ".listing", format="plain", required=false) -%}
{%- else -%}
{%- set data = load_data(path="static" ~ path, format="plain", required=false) -%}
{%- endif -%}
 - [Download]({{path}}) {%- if download_comment %} {{ download_comment }}{%- endif %}
 - <a href="#" onclick="show_hide()">Show/Hide Source Code</a>

<style>
.code-listing {
  display: inline-block;
  opacity: 0;
  overflow: hidden;
  height: 0;
  transition: height 0ms 400ms, opacity 400ms 0ms;
}
.visible {
  opacity: 1;
  height: auto;
  transition: height 0ms 0ms, opacity 600ms 0ms;
}
</style>

<div class="code-listing">

```{% if hlang %}{{hlang}}{% endif %}
{{ data }}
```

<button onclick="show_hide()">Hide Source Code</button>
</div>

<script>
  function show_hide() {
    document.body.querySelector('.code-listing').classList.toggle('visible');
  }
</script>
