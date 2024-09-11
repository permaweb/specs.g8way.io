const foo = () => {
  return (
  <><h1>Path-Manifest Schema</h1>
<p>Status: Published</p>
<p>Version: v1</p>
<h2>Abstract</h2>
<p>The Arweave Path Manifest Schema is a specification for defining path manifests used in the Arweave blockchain protocol. Path manifests are JSON objects that describe the mapping between subpaths and the content they resolve to. The schema includes mandatory fields such as manifest (identifying the manifest type as arweave/paths) and version (specifying the version of the schema). Optional fields like index allow defining default behaviors when accessing the manifest directly. The paths field is essential, providing the mapping between subpaths and the corresponding transaction IDs to resolve for each subpath.</p>
<h2>Motivation</h2>
<p>To provide a standardized and structured way to define and manage the mapping between subpaths and content within the Arweave blockchain protocol. It serves several purposes:</p>
<ol>
<li><strong>Efficient Content Resolution:</strong> The path manifest allows efficient resolution of content within the Arweave network. By specifying the transaction IDs associated with specific subpaths, clients can easily retrieve the desired content without the need to search or traverse the entire blockchain.</li>
<li><strong>Improved User Experience:</strong> The manifest enables a better user experience by providing default behaviors and a clear mapping between subpaths and content. Clients or gateways can use the manifest to determine the default path to load and serve the appropriate content. It simplifies the process of accessing and navigating content stored on the Arweave network.</li>
<li><strong>Consistency and Interoperability:</strong> The schema promotes consistency and interoperability across different implementations and applications utilizing the Arweave protocol. By defining a standardized structure for path manifests, developers can create tools, services, and applications that can interpret and utilize path mappings consistently.</li>
</ol>
<p>This manifest enables gateways to serve content similar to a web server and its specified <code>routes</code>. This allows developers the ability to server web content from an Arweave Gateway.</p>
<h2>Specification</h2>
<h3>Schema</h3>
<p>Path manifests are JSON objects with the following keys.</p>
<table>
<thead>
<tr>
<th>Field</th>
<th>Mandatory?</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr>
<td><code>manifest</code></td>
<td>✓</td>
<td>string</td>
<td>The manifest type identifier, this MUST be <code>arweave/paths</code>.</td>
</tr>
<tr>
<td><code>version</code></td>
<td>✓</td>
<td>string</td>
<td>The manifest specification version, currently &quot;0.1.0&quot;. This will be updated with future updates according to <a href="https://semver.org">semver</a>.</td>
</tr>
<tr>
<td><code>index</code></td>
<td />
<td>object</td>
<td>The behavior gateways SHOULD follow when the manifest is accessed directly. When defined, <code>index</code> MUST contain a member describing the behavior to adopt. Currently, the only supported behavior is <code>path</code>. <code>index</code> MAY be be omitted, in which case gateways SHOULD serve a listing of all paths.</td>
</tr>
<tr>
<td><code>index.path</code></td>
<td />
<td>string</td>
<td>The default path to load. If defined, the field MUST reference a key in the <code>paths</code> object (it MUST NOT reference a transaction ID directly).</td>
</tr>
<tr>
<td><code>paths</code></td>
<td>✓</td>
<td>object</td>
<td>The path mapping between subpaths and the content they resolve to. The object keys represent the subpaths, and the values tell us which content to resolve to.</td>
</tr>
<tr>
<td><code>paths[path].id</code></td>
<td>✓</td>
<td>string</td>
<td>The transaction ID to resolve to for the given path.</td>
</tr>
</tbody></table>
<p>A path manifest transaction MUST NOT contain any data other than this JSON object.<br>If <code>path</code> name is equal to &#39;*&#39; then all routes that are not found will be directed to the tx id in the value object. </br> </p>
<p>The <code>Content-Type</code> tag for manifest files MUST be <code>application/x.arweave-manifest+json</code>, users MAY add other arbitrary user defined tags.</p>
<p><strong>Example manifest</strong></p>
<pre>
  <code class="language-json">
    {'{'}
    &quot;manifest&quot;: &quot;arweave/paths&quot;,
  &quot;version&quot;: &quot;0.1.0&quot;,
  &quot;index&quot;: {'{'}
    &quot;path&quot;: &quot;index.html&quot;
  {'}'},
  &quot;paths&quot;: {'{'}
    &quot;index.html&quot;: {'{'}
      &quot;id&quot;: &quot;cG7Hdi_iTQPoEYgQJFqJ8NMpN4KoZ-vH_j7pG4iP7NI&quot;
      {'}'},
    &quot;js/style.css&quot;: {'{'}
      &quot;id&quot;: &quot;fZ4d7bkCAUiXSfo3zFsPiQvpLVKVtXUKB6kiLNt2XVQ&quot;
      {'}'},
    &quot;css/style.css&quot;: {'{'}
      &quot;id&quot;: &quot;fZ4d7bkCAUiXSfo3zFsPiQvpLVKVtXUKB6kiLNt2XVQ&quot;
      {'}'},
    &quot;css/mobile.css&quot;: {'{'}
      &quot;id&quot;: &quot;fZ4d7bkCAUiXSfo3zFsPiQvpLVKVtXUKB6kiLNt2XVQ&quot;
      {'}'},
    &quot;assets/img/logo.png&quot;: {'{'}
      &quot;id&quot;: &quot;QYWh-QsozsYu2wor0ZygI5Zoa_fRYFc8_X1RkYmw_fU&quot;
      {'}'},
    &quot;assets/img/icon.png&quot;: {'{'}
      &quot;id&quot;: &quot;0543SMRGYuGKTaqLzmpOyK4AxAB96Fra2guHzYxjRGo&quot;
      {'}'},
    &quot;*&quot;: {'{'}
      &quot;id&quot;: &quot;cG7Hdi_iTQPoEYgQJFqJ8NMpN4KoZ-vH_j7pG4iP7NI&quot;
      {'}'}
      {'}'}
      {'}'}
</code></pre></>)
}

export default foo