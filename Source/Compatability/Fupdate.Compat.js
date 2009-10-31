var Fupdate = Form.Request;
if (Form.Request.Append) Fupdate.Append = Form.Request.Append;
if (Form.Request.Prompt) Fupdate.Append.Prompt = Form.Request.Prompt;
if (Form.Request.Append && Form.Request.Append.AjaxPrompt) Fupdate.Append.AjaxPrompt = Form.Request.Append.AjaxPrompt;
