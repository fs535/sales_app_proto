<!DOCTYPE html>

<html lang="en">

<body>

    <h1>Gateway</h1>
	Date: ${time?date}
	<br>
	Time: ${time?time}
	<br><br>
	API definitions:
    <ul>
    <#list apiDefinitions as def>
        <li>${def.proxy.listenPath} - ${def.proxy.targetUrl}</li>
    </#list>
    </ul>
</body>

</html>
