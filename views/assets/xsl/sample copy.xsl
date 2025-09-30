Replace: 

^(\s*)<xsl:when\s+test="Sources/Source\[1\]/StageCode\s*=\s*'BDIS'">

With: 

$1<xsl:when test="Sources/Source[1]/StageDesc = 'Rayuan kes Jenayah Komersial dari Mahkamah Sesyen'
$1	or Sources/Source[1]/StageDesc = 'Rayuan kes Jenayah Komersial dari Mahkamah Sesyen (Perkhidmat Awam)'
$1	or Sources/Source[1]/StageDesc = 'Kes Jenayah Komersial'">
$1	<xsl:text>Commercial Crime</xsl:text>
$1</xsl:when>
$1<xsl:when test="Sources/Source[1]/StageDesc = 'Seksyen 39B Akta Dadah Berbahaya 1952'
$1	or Sources/Source[1]/StageDesc = 'Seksyen 39B Akta Dadah Berbahaya 1952 (Perkhidmat Awam)'">
$1	<xsl:text>Dangerous Drugs Act 1952</xsl:text>
$1</xsl:when>
$1<xsl:when test="Sources/Source[1]/StageCode = 'BDIS'">\n


Replace: 

^(\s*)<xsl:when\s+test="\$nextValidSource/StageCode\s*=\s*'BDIS'">

With:

$1<xsl:when test="$nextValidSource/StageDesc = 'Rayuan kes Jenayah Komersial dari Mahkamah Sesyen'
$1	or $nextValidSource/StageDesc = 'Rayuan kes Jenayah Komersial dari Mahkamah Sesyen (Perkhidmat Awam)'
$1	or $nextValidSource/StageDesc = 'Kes Jenayah Komersial'">
$1	<xsl:text>Commercial Crime</xsl:text>
$1</xsl:when>
$1<xsl:when test="$nextValidSource/StageDesc = 'Seksyen 39B Akta Dadah Berbahaya 1952'
$1	or $nextValidSource/StageDesc = 'Seksyen 39B Akta Dadah Berbahaya 1952 (Perkhidmat Awam)'">
$1	<xsl:text>Dangerous Drugs Act 1952</xsl:text>
$1</xsl:when>
$1<xsl:when test="$nextValidSource/StageCode = 'BDIS'">\n

Replace:

^(\s*)<xsl:choose>\s*<xsl:when\s+test="Sources/Source\[1\]/StageCode\s*=\s*'WEFILING'\s+or\s+Sources/Source\[1\]/StageCode\s*=\s*'BEFILING'\s+or\s+Sources/Source\[1\]/StageCode\s*=\s*'AUC'">\n

With:

$1<xsl:choose>
$1    <xsl:when test="Sources/Source[1]/StageCode = 'CRI'">
$1        <xsl:text>CIVIL - </xsl:text>
$1    </xsl:when>
$1    <xsl:otherwise>
$1        <xsl:text>CRIMINAL - </xsl:text>
$1    </xsl:otherwise>
$1</xsl:choose>
$1<xsl:choose>
$1    <xsl:when test="Sources/Source[1]/StageCode = 'WEFILING' or Sources/Source[1]/StageCode = 'BEFILING' or Sources/Source[1]/StageCode = 'AUC'">\n