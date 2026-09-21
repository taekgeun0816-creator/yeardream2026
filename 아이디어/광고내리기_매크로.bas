'================================================================
' 매물장 → AI파트너(이실장) 광고 내리기 연동 매크로
'
' 동작: 상태 칸에 "거래완료"를 입력하면
'        1) 매물번호를 클립보드에 복사
'        2) 크롬으로 AI파트너 매물광고 목록 페이지 열기
'        3) 거래완료일을 자동 기록
'       → 검색창에 Ctrl+V 붙여넣고 검색 → [거래완료] 버튼 클릭
'
' 설치 방법
'  1. 엑셀에서 Alt+F11 (VBA 편집기)
'  2. 왼쪽 목록에서 매물 시트를 더블클릭 (모듈 아님! 시트에 넣어야 작동)
'  3. 이 코드 전체를 붙여넣기
'  4. 아래 설정값을 본인 시트에 맞게 수정
'  5. 파일을 "Excel 매크로 사용 통합 문서(.xlsm)"로 저장
'================================================================

' ───────── 설정 (본인 시트에 맞게 수정) ─────────
Private Const COL_STATUS As Long = 5        ' 상태 칸 열번호 (A=1, B=2, ... E=5)
Private Const COL_OFFER_NO As Long = 1      ' 매물번호(이실장) 열번호
Private Const COL_DONE_DATE As Long = 6     ' 거래완료일 기록할 열번호 (0이면 기록 안 함)
Private Const TRIGGER_TEXT As String = "거래완료"
Private Const AD_URL As String = "https://www.aipartner.com/offerings/ad_list"
' ────────────────────────────────────────────────

Private Sub Worksheet_Change(ByVal Target As Range)
    Dim c As Range
    Dim offerNo As String

    ' 상태 열이 아니면 무시
    If Intersect(Target, Me.Columns(COL_STATUS)) Is Nothing Then Exit Sub

    Application.EnableEvents = False
    On Error GoTo CleanUp

    For Each c In Intersect(Target, Me.Columns(COL_STATUS))
        If c.Row > 1 And Trim(CStr(c.Value)) = TRIGGER_TEXT Then

            offerNo = Trim(CStr(Me.Cells(c.Row, COL_OFFER_NO).Value))

            ' 거래완료일 기록
            If COL_DONE_DATE > 0 Then
                If Me.Cells(c.Row, COL_DONE_DATE).Value = "" Then
                    Me.Cells(c.Row, COL_DONE_DATE).Value = Date
                End If
            End If

            If offerNo = "" Then
                MsgBox "매물번호가 비어 있습니다. " & c.Row & "행을 확인하세요.", vbExclamation
            Else
                CopyToClipboard offerNo
                OpenInChrome AD_URL
                MsgBox "매물번호 " & offerNo & " 를 복사했습니다." & vbCrLf & vbCrLf & _
                       "1. 열린 페이지의 [매물번호] 검색칸 클릭" & vbCrLf & _
                       "2. Ctrl+V 로 붙여넣고 검색" & vbCrLf & _
                       "3. 해당 매물의 [거래완료] 버튼 클릭", vbInformation, "광고 내리기"
            End If

            Exit For   ' 한 번에 한 건만 처리
        End If
    Next c

CleanUp:
    Application.EnableEvents = True
End Sub


' 클립보드에 텍스트 복사 (별도 참조 설정 불필요)
Private Sub CopyToClipboard(ByVal txt As String)
    Dim obj As Object
    On Error Resume Next
    Set obj = GetObject("New:{1C3B4210-F441-11CE-B9EA-00AA006B1A69}")  ' MSForms.DataObject
    obj.SetText txt
    obj.PutInClipboard
    On Error GoTo 0
End Sub


' 크롬으로 URL 열기 (크롬이 없으면 기본 브라우저로)
Private Sub OpenInChrome(ByVal url As String)
    Dim paths As Variant, p As Variant
    Dim opened As Boolean

    paths = Array( _
        "C:\Program Files\Google\Chrome\Application\chrome.exe", _
        "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe", _
        Environ$("LOCALAPPDATA") & "\Google\Chrome\Application\chrome.exe")

    For Each p In paths
        If Dir(CStr(p)) <> "" Then
            Shell """" & p & """ """ & url & """", vbNormalFocus
            opened = True
            Exit For
        End If
    Next p

    If Not opened Then ThisWorkbook.FollowHyperlink url
End Sub
