Set WshShell = CreateObject("WScript.Shell")
' El 0 oculta la ventana negra del bat, pero el bat sigue corriendo
' esperando a que cierres Chrome.
WshShell.Run chr(34) & "initializer.bat" & chr(34), 0
Set WshShell = Nothing