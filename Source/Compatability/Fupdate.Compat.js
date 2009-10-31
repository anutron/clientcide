var Fupdate = Form.Request;
if (Form.Request.Prompt) Fupdate.Prompt = Form.Request.Prompt;
if (Form.Request.Append.Prompt) Fupdate.Append.Prompt = Form.Request.Append.Prompt;
if (Form.Request.Append && Form.Request.Append.AjaxPrompt) Fupdate.Append.AjaxPrompt = Form.Request.Append.AjaxPrompt;
