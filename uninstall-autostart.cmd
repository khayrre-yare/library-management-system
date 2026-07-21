@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Unregister-ScheduledTask -TaskName 'Jamhuuriyo Library Auto Start' -Confirm:$false -ErrorAction SilentlyContinue"
echo Jamhuuriyo Library auto-start has been removed.
pause
